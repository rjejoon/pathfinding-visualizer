import styled from "styled-components";

import Node, { NodeDim } from "./Node";
import { Vertex } from "../types";
import { useContext, useRef } from "react";
import { getSourceAndDest } from "../grid";
import { VisualizeStateContext } from "../context/VisualizeStateContext";

interface RowProps {
  readonly $height: number;
}

interface GridDim {
  readonly $width: number;
  readonly $height: number;
}

enum EditMode {
  Null,
  Source,
  Dest,
  Wall,
  Erase,
  Weight,
}

type GridProps = {
  grid: Vertex[][];
  gridDim: GridDim;
  nodeDim: NodeDim;
  visualize: () => void;
};

export default function Grid({ grid, gridDim, nodeDim, visualize }: GridProps) {
  const editMode = useRef(EditMode.Null);
  const lastEditedVertex = useRef<Vertex | null>(null);
  const visualizeState = useContext(VisualizeStateContext);

  /**
   * Change edit mode depending on which type of vertex the mouse is pointing.
   *
   * @param target - Vertex object at the pointer
   */
  function changeEditMode(target: Vertex) {
    if (target.isSource) {
      editMode.current = EditMode.Source;
    } else if (target.isDest) {
      editMode.current = EditMode.Dest;
    } else if (target.isWall) {
      editMode.current = EditMode.Erase;
    } else {
      editMode.current = EditMode.Wall;
    }
  }

  /**
   *
   * @param target - Vertex object at the pointer
   */
  function editVertex(target: Vertex) {
    if (editMode.current === EditMode.Null) {
      return;
    }

    // if (lastEditedVertex.current && v.isEqual(lastEditedVertex.current)) {
    //   // prevent triggering editing within the same vertex
    //   return;
    // }

    const [currSource, currDest] = getSourceAndDest(grid);
    switch (editMode.current) {
      case EditMode.Source:
        if (target.isWall || target.isDest) {
          break;
        }
        grid[currSource.row][currSource.col].isSource = false;
        target.isSource = true;
        break;
      case EditMode.Dest:
        if (target.isWall || target.isSource) {
          break;
        }
        grid[currDest.row][currDest.col].isDest = false;
        target.isDest = true;
        break;
      case EditMode.Wall:
        if (!target.isSource && !target.isDest) {
          target.isWall = true;
        }
        break;
      case EditMode.Erase:
        if (!target.isSource && !target.isDest) {
          target.isWall = false;
        }
        break;
      default:
        return;
    }
    lastEditedVertex.current = target;
  }

  function resetEditMode() {
    editMode.current = EditMode.Null;
  }

  const nodeElements = [];
  for (let i = 0; i < grid.length; i++) {
    const children = grid[i].map((v) => (
      <Node
        key={`(${v.row}, ${v.col}`}
        nodeDim={nodeDim}
        ref={(el) => (v.htmlElement = el)}
        handleMouseDown={() => {
          // console.log("mouse down");
          changeEditMode(v);
        }}
        handleMouseUp={() => {
          // console.log("mouse up");
          resetEditMode();
        }}
        handleMouseMove={() => {
          // console.log("mouse move");
          editVertex(v);
          if (visualizeState === "finished") {
            visualize();
          }
        }}
        handleMouseClick={() => {
          // console.log("mouse click");
          changeEditMode(v);
          console.log(editMode.current);
          editVertex(v);
          if (visualizeState === "finished") {
            visualize();
          }
          resetEditMode();
        }}
      />
    ));
    nodeElements.push(
      <Row key={`row_${i}`} $height={nodeDim.$height}>
        {children}
      </Row>
    );
  }

  return (
    <StyledGrid gridStyle={gridDim} as="main">
      {nodeElements}
    </StyledGrid>
  );
}

const StyledGrid = styled.div<{ gridStyle: GridDim }>`
  height: ${(props) => props.gridStyle.$height}px;
  width: ${(props) => props.gridStyle.$width}px;
`;

const Row = styled.div<RowProps>`
  height: ${(props) => props.$height}px;

  &:nth-last-child(-n + 1) {
    border-bottom: 0.5px solid black;
  }
`;
