import styled from 'styled-components';

import Node, { NodeDim } from './Node';
import { Vertex } from '../types';


interface RowProps {
  readonly $height: number;
}

interface GridDim {
  readonly $width: number;
  readonly $height: number;
}

type GridProps = {
  grid: Vertex[][];
  gridDim: GridDim;
  nodeDim: NodeDim;
  handleMouseDown: (target: Vertex) => void;
  handleMouseUp: () => void;
  handleMouseMove: (target: Vertex) => void;
}

export default function Grid({
  grid,
  gridDim,
  nodeDim,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove
}: GridProps) {

  const nodeElements = [];
  for (let i = 0; i < grid.length; i++) {
    const children = grid[i].map(v => (
      <Node
        key={`(${v.row}, ${v.col}`}
        nodeDim={nodeDim}
        ref={el => v.htmlElement = el}
        handleMouseDown={() => handleMouseDown(v)}
        handleMouseUp={handleMouseUp}
        handleMouseMove={() => handleMouseMove(v)}
      />
    ));
    nodeElements.push(<Row key={`row_${i}`} $height={nodeDim.$height} >{children}</Row>);
  }

  return (
    <StyledGrid gridStyle={gridDim} as="main">
      {nodeElements}
    </StyledGrid>
  );
};


const StyledGrid = styled.div<{ gridStyle: GridDim }>`
  height: ${props => props.gridStyle.$height}px;
  width: ${props => props.gridStyle.$width}px;
`;

const Row = styled.div<RowProps>`

  height: ${props => props.$height}px;

  &:nth-last-child(-n+1) {
    border-bottom: 0.5px solid black;
  }
`;