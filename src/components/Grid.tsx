import styled from 'styled-components';

import Node, { NodeStyle } from './Node';
import { Vertex } from '../types';


interface RowProps {
  readonly $height: number;
}

interface GridStyle {
  readonly $width: number;
  readonly $height: number;
}

interface GridProps {
  grid: Vertex[][];
  gridStyle: GridStyle;
  nodeStyle: NodeStyle;
  nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[][]>;
  handleMouseDown: (target: Vertex) => void;
  handleMouseUp: () => void;
  handleMouseMove: (target: Vertex) => void;
}

export default function Grid({
  grid,
  gridStyle,
  nodeStyle,
  nodeRefs,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove
}: GridProps) {

  const nodeElements = [];
  for (let i = 0; i < grid.length; i++) {
    const children = grid[i].map(v => (
      <Node
        key={`(${v.row}, ${v.col}`}
        ref={el => { nodeRefs.current[v.row][v.col] = el; }}
        vert={v}
        nodeStyle={nodeStyle}
        handleMouseDown={() => handleMouseDown(v)}
        handleMouseUp={handleMouseUp}
        handleMouseMove={() => handleMouseMove(v)}
      />
    ));
    nodeElements.push(<Row key={`row_${i}`} $height={nodeStyle.$height} >{children}</Row>);
  }

  return (
    <StyledGrid gridStyle={gridStyle} as="main">
      {nodeElements}
    </StyledGrid>
  );
};


const StyledGrid = styled.div<{ gridStyle: GridStyle }>`
  height: ${props => props.gridStyle.$height}px;
  width: ${props => props.gridStyle.$width}px;
`;

const Row = styled.div<RowProps>`

  height: ${props => props.$height}px;

  &:nth-last-child(-n+1) {
    border-bottom: 0.5px solid black;
  }
`;