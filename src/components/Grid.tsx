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

const Grid: React.FC<{ size: GridSize }> = (props) => {
  let w = DESIRED_DIM, h = DESIRED_DIM;
  const numRow = Math.floor(props.size.height / h);
  const numCol = Math.floor(props.size.width / w);

  // adjust width and height
  w += (props.size.width - numCol * w) / numCol - 0.01;
  h += (props.size.height - numRow * h) / numRow - 0.01;

  const [grid, setGrid] = useState<Vertex[][]>(initGrid(numRow, numCol));

  // change source and dest on resize
  useEffect(() => {
    setGrid(initGrid(numRow, numCol));
  }, [numRow, numCol]);


  // add cells

  const cells = [];
  for (let i = 0; i < grid.length; i++) {
    const children = grid[i].map(v => (
      <Cell
        key={`(${v.row}, ${v.col}`}
        row={v.row}
        col={v.col}
        isSource={v.isSource}
        isDest={v.isDest}
        $width={w}
        $height={h}
        handleMouseEnter={() => console.log('entered')}
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
