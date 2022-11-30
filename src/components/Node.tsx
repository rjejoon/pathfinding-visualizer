import { forwardRef } from 'react';
import styled from 'styled-components';

import { Vertex } from '../types';


export interface NodeDim {
  readonly $width: number;
  readonly $height: number;
}

type NodeProps = {
  className?: string;
  nodeDim: NodeDim
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseMove: () => void;
}
type NodeRef = HTMLDivElement;

const BaseNode = forwardRef<NodeRef, NodeProps>((props, ref) => (
  <div
    ref={ref}
    className={props.className}
    draggable="false"
    onMouseDown={props.handleMouseDown}
    onMouseUp={props.handleMouseUp}
    onMouseMove={props.handleMouseMove}>
  </div>
));

const Node = styled(BaseNode).attrs(props => ({

  className: props.className,

}))`

  &:nth-child(1) { 
    border-left: 0.5px solid black;
  }

  border-right: 0.5px solid black;

  & .isSource {
    background-color: '#66ff66';
  }
  & .isDest {
    background-color: '#ff6666';
  }
  & .isVisited {
    background-color: '#99e6ff';
  }
  & .isWall {
    background-color: #163057;
    border: none;
  }
  & .isPath {
    background-color: '#ffff99';
  }

  display: inline-block;
  width: ${props => props.nodeDim.$width}px;
  height: ${props => props.nodeDim.$height}px;
  
  border-top: 0.5px solid black;

  /* transition: background-color 0.5s cubic-bezier(0,1.02,1,.98); */
`;


export default Node;
