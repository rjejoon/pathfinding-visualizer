import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import Grid from "./components/Grid";

import { GraphAlgoOptions, Vertex } from "./types";
import { initGrid, getSourceAndDest } from "./grid";
import algoVisualizers from "./graph/visualizer-map";
import useWindowSize from "./hooks/use-window-size";

const DESIRED_DIM = 25;

enum EditMode {
  Null,
  Source,
  Dest,
  Wall,
  Weight,
}

export default function App() {
  const windowSize = useWindowSize();
  const navbarHeight = 70;

  const gridWidth = windowSize.width || 0;
  const gridHeight = (windowSize.height || 0) - navbarHeight;

  let w = DESIRED_DIM;
  let h = DESIRED_DIM;
  const numRow = Math.floor(gridHeight / DESIRED_DIM);
  const numCol = Math.floor(gridWidth / DESIRED_DIM);

  // adjust width and height
  w += (gridWidth - numCol * w) / numCol - 0.01;
  h += (gridHeight - numRow * h) / numRow - 0.01;

  const gridRef = useRef(initGrid(numRow, numCol));
  const editMode = useRef(EditMode.Null);
  const lastEditedVertex = useRef<Vertex | null>(null);
  const [algoValue, setAlgoValue] = useState<GraphAlgoOptions>("bfs");
  const [, setNow] = useState(new Date()); // used to force deep re-rendering
  const [hasVisualized, setHasVisualized] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);

  /**
   * Reset grid.
   */
  const resetGrid = useCallback(() => {
    gridRef.current = initGrid(numRow, numCol);
    setHasVisualized(false);
    forceDeepRender();
  }, [numRow, numCol]);

  useEffect(() => {
    // reset grid on resize
    resetGrid();
  }, [numRow, numCol, resetGrid]);

  /**
   * Change edit mode depending on which type of vertex the mouse is pointing.
   * If mouse is down on source vertex, set EditMode to Source.
   * If mouse is down on destination vertex, set EditMode to Dest.
   * Otherwise, set EditMode to Wall.
   *
   * @param target - Vertex object at the pointer
   */
  function changeEditMode(target: Vertex) {
    if (target.isSource) {
      editMode.current = EditMode.Source;
    } else if (target.isDest) {
      editMode.current = EditMode.Dest;
    } else {
      editMode.current = EditMode.Wall;
    }
  }

  function resetEditMode() {
    editMode.current = EditMode.Null;
  }

  /**
   * Force deep re-rendering.
   */
  function forceDeepRender() {
    setNow(new Date());
  }

  /**
   *
   * @param target - Vertex object at the pointer
   */
  function editGrid(target: Vertex) {
    if (editMode.current === EditMode.Null) {
      return;
    }

    const v = gridRef.current[target.row][target.col];
    if (lastEditedVertex.current && v.isEqual(lastEditedVertex.current)) {
      // prevent triggering editing within the same vertex
      return;
    }

    const [currSource, currDest] = getSourceAndDest(gridRef.current);
    switch (editMode.current) {
      case EditMode.Source:
        if (v.isWall || v.isDest) {
          break;
        }
        gridRef.current[currSource.row][currSource.col].isSource = false;
        v.isSource = true;
        break;
      case EditMode.Dest:
        if (v.isWall || v.isSource) {
          break;
        }
        gridRef.current[currDest.row][currDest.col].isDest = false;
        v.isDest = true;
        break;
      case EditMode.Wall:
        if (!v.isSource && !v.isDest) {
          v.isWall = !v.isWall;
        }
        break;
      default:
        return;
    }
    lastEditedVertex.current = v;
    if (hasVisualized) {
      visualize();
    }
  }

  /**
   * Visualize the selected algorithm.
   */
  async function visualize() {
    if (!(algoValue in algoVisualizers)) {
      console.error(`Error: Invalid algoValue: ${algoValue}`);
      return;
    }

    if (isVisualizing) {
      // prevent multiple visualizations
      return;
    }
    setIsVisualizing(true);

    // reset visited and path nodes
    for (let r = 0; r < gridRef.current.length; r++) {
      for (let c = 0; c < gridRef.current[0].length; c++) {
        gridRef.current[r][c].isVisited = false;
        gridRef.current[r][c].isPath = false;
      }
    }

    const visualizer = algoVisualizers[algoValue](gridRef.current);

    if (visualizer === null) {
      console.error(`Error: ${algoValue} failed`);
      return;
    }

    const { visitedVerticesInOrder, parents, source, dest } = visualizer;

    const visitPromises: Promise<number>[] = [];

    for (let i = 0; i < visitedVerticesInOrder.length; i++) {
      const targetV = visitedVerticesInOrder[i];
      if (hasVisualized) {
        gridRef.current[targetV.row][targetV.col].isVisited = true;
      } else {
        visitPromises.push(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              gridRef.current[targetV.row][targetV.col].isVisited = true;
              resolve(i);
            }, 5 * i);
          })
        );
      }
    }

    if (!hasVisualized) {
      await Promise.all(visitPromises);
    }
    animatePath(parents, source, dest);
    setHasVisualized(true);
    setIsVisualizing(false);
  }

  function animatePath(parents: Vertex[][], source: Vertex, v: Vertex): number {
    if (v === undefined) {
      return -1;
    }
    let i = 0;
    if (!v.isEqual(source)) {
      i = animatePath(parents, source, parents[v.row][v.col]);
    }

    if (hasVisualized) {
      gridRef.current[v.row][v.col].isPath = true;
    } else {
      setTimeout(() => {
        gridRef.current[v.row][v.col].isPath = true;
      }, 10 * i);
    }
    return i + 1;
  }

  function changeAlgoOptionOnChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setAlgoValue(event.target.value as GraphAlgoOptions);
    resetGrid();
  }

  return (
    <>
      <Navbar
        navbarStyle={{ $height: navbarHeight }}
        algoValue={algoValue}
        changeAlgoOnChange={changeAlgoOptionOnChange}
        visualizeOnClick={visualize}
        resetGridOnClick={() => {
          if (isVisualizing) {
            // prevent resetting grid while visualizing
            return;
          }
          resetGrid();
        }}
      />
      <Grid
        grid={gridRef.current}
        gridDim={{ $width: gridWidth, $height: gridHeight }}
        nodeDim={{ $width: w, $height: h }}
        handleMouseDown={changeEditMode}
        handleMouseUp={resetEditMode}
        handleMouseMove={editGrid}
        // handleMouseClick={editGrid}
      />
    </>
  );
}
