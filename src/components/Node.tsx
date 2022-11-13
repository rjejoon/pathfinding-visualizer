import styled from 'styled-components';

import Vertex from '../models/vertex';


export interface NodeStyle {
  readonly $width: number;
  readonly $height: number;
}

interface NodeProps {
  className?: string;
  vert: Vertex;
  nodeStyle: NodeStyle
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseMove: () => void;
}

function BaseNode(props: NodeProps) {
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

const Node = styled(BaseNode)`
  display: inline-block;
  width: ${props => props.nodeStyle.$width}px;
  height: ${props => props.nodeStyle.$height}px;
  
  border-top: 0.5px solid black;

  &:nth-child(1) { 
    border-left: 0.5px solid black;
  }

  border-right: 0.5px solid black;

  background-color: ${props => {
    if (props.vert.isSource) return '#66ff66';
    else if (props.vert.isDest) return '#ff6666';
    else if (props.vert.isWall) return 'gray';
    else if (props.vert.isVisited) return '#99e6ff';
    else if (props.vert.isPath) return '#ffff99';
    return 'white';
  }}
`;


export default Node;
