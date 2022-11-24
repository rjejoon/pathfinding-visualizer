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
    let color: string = 'white';
    if (props.vert.isSource)
      color = '#66ff66';
    else if (props.vert.isDest)
      color = '#ff6666';
    else if (props.vert.isVisited)
      color = '#99e6ff';

    // higher precedence
    if (props.vert.isWall)
      color = '#163057';
    else if (props.vert.isPath)
      color = '#ffff99';
    return color;
  }};

  border: ${props => {
    if (props.vert.isWall) return 'none';
  }};

  /* transition: background-color 0.5s cubic-bezier(0,1.02,1,.98); */
`;


export default Node;
