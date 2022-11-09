import styled from 'styled-components';

import Vertex from '../models/vertex';


interface CellProps {
  className?: string;
  vert: Vertex;
  readonly $width: number;
  readonly $height: number;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseMove: () => void;
}

function BaseCell(props: CellProps) {
  return (
    <div
      className={props.className}
      draggable="false"
      onMouseDown={props.handleMouseDown}
      onMouseUp={props.handleMouseUp}
      onMouseMove={props.handleMouseMove}>
    </div>
  );
}

const Cell = styled(BaseCell)`
  display: inline-block;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  
  border-top: 0.5px solid black;

  &:nth-child(1) { 
    border-left: 0.5px solid black;
  }

  border-right: 0.5px solid black;

  background-color: ${props => {
    if (props.vert.isSource) return 'green';
    else if (props.vert.isDest) return 'red';
    else if (props.vert.isWall) return 'gray';
    return 'white';
  }}
`;


export default Cell;
