import { forwardRef } from "react";
import styled from "styled-components";

export interface NodeDim {
  readonly $width: number;
  readonly $height: number;
}

type NodeProps = {
  className?: string;
  nodeDim: NodeDim;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseMove: () => void;
  handleMouseClick: () => void;
};

type NodeRef = HTMLDivElement;

const BaseNode = forwardRef<NodeRef, NodeProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className={props.className}
      draggable="false"
      onMouseDown={props.handleMouseDown}
      onMouseUp={props.handleMouseUp}
      onMouseMove={props.handleMouseMove}
      onClick={props.handleMouseClick}
    ></div>
  );
});

const Node = styled(BaseNode).attrs((props) => ({
  className: props.className,
}))`
  &:nth-child(1) {
    border-left: 0.5px solid black;
  }

  border-right: 0.5px solid black;

  display: inline-block;
  width: ${(props) => props.nodeDim.$width}px;
  height: ${(props) => props.nodeDim.$height}px;

  border-top: 0.5px solid black;

  /* transition: background-color 0.5s cubic-bezier(0,1.02,1,.98); */
`;

export default Node;
