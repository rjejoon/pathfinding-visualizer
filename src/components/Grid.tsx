import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Cell from './Cell';
import Coord from '../models/coord';
import Vertex from '../models/vertex';


const DESIRED_DIM = 25;



interface RowProps {
  readonly $height: number;
}
interface GridSize {
  width: number;
  height: number;
}

enum EditMode {
  Null,
  Source,
  Dest,
  Wall,
  Weight,
}

const Grid: React.FC<{ size: GridSize }> = (props) => {
  let w = DESIRED_DIM, h = DESIRED_DIM;
  const numRow = Math.floor(props.size.height / h);
  const numCol = Math.floor(props.size.width / w);

  // adjust width and height
  w += (props.size.width - numCol * w) / numCol - 0.01;
  h += (props.size.height - numRow * h) / numRow - 0.01;

  const [grid, setGrid] = useState<Vertex[][]>(initGrid(numRow, numCol));
  const [editMode, setEditMode] = useState(EditMode.Null);

  // reset grid on resize
  useEffect(() => {
    setGrid(initGrid(numRow, numCol));
  }, [numRow, numCol]);

  function handleMouseDown(target: Vertex) {
    console.log(target);
    if (target.isSource) {
      setEditMode(EditMode.Source);
    } else if (target.isDest) {
      setEditMode(EditMode.Dest);
    } else {
      setEditMode(EditMode.Wall);
    }
  }

  function handleMouseUp() {
    setEditMode(EditMode.Null);
  }

  function handleMouseMove(target: Vertex) {
    console.log(target);
    if (editMode === EditMode.Wall) {
      setGrid(prevGrid => {
        return prevGrid.map(row => (row.map(v => {
          if (v.isSource || v.isDest || !(v.row === target.row && v.col === target.col))
            return v;
          v.isWall = true;
          return v;
        })));
      });
    }
  }

  // add cells
  const cells = [];
  for (let i = 0; i < grid.length; i++) {
    const children = grid[i].map(v => (
      <Cell
        key={`(${v.row}, ${v.col}`}
        vert={v}
        $width={w}
        $height={h}
        handleMouseDown={() => handleMouseDown(v)}
        handleMouseUp={handleMouseUp}
        handleMouseMove={() => handleMouseMove(v)}
      />
    ));
    cells.push(<Row key={`row_${i}`} $height={h} >{children}</Row>);
  }


  return (
    <StyledGrid size={props.size} as="main">
      {cells}
    </StyledGrid>
  );
};

function initGrid(numRow: number, numCol: number): Vertex[][] {
  const source: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.20));
  const dest: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.80));

  const grid: Vertex[][] = [];
  for (let r = 0; r < numRow; r++) {
    const row: Vertex[] = [];
    for (let c = 0; c < numCol; c++) {
      const v = new Vertex(r, c);
      v.isSource = (r === source.row && c === source.col);
      v.isDest = (r === dest.row && c === dest.col);
      row.push(v);
    }
    grid.push(row);
  }
  return grid;
}

const StyledGrid = styled.div<{ size: GridSize }>`
  height: ${props => props.size.height}px;
  width: ${props => props.size.width}px;
`;

const Row = styled.div<RowProps>`

  height: ${props => props.$height}px;

  &:nth-last-child(-n+1) {
    border-bottom: 0.5px solid black;
  }
`;


export default Grid;
