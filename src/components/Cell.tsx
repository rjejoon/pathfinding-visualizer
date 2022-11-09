import styled from 'styled-components';


interface CellProps {
  className?: string;
  readonly row: number;
  readonly col: number;
  readonly $width: number;
  readonly $height: number;
  isSource: boolean;
  isDest: boolean;
  handleMouseEnter: () => void;
}

function BaseCell(props: CellProps) {
  return (
    <div className={props.className} onMouseEnter={props.handleMouseEnter}></div>
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
    if (props.isSource) return 'green';
    else if (props.isDest) return 'red';
    return 'white';
  }}
`;


export default Cell;
