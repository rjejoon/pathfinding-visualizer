import styled from 'styled-components';


const DESIRED_DIM = 25;

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

  // add cells
  const cells = [];
  for (let r = 0; r < numRow; r++) {
    const children = [];
    for (let c = 0; c < numCol; c++) {
      children.push(<Cell key={`(${r}, ${c}`} row={r} col={c} width={w} height={h} />)
    }
    cells.push(<Row key={`row=${r}`} row={r} height={h} >{children}</Row>);
  }

  return (
    <main>
      {cells}

    </main>
  );
};


const StyledGrid = styled.div<{ size: GridSize }>`
  height: ${props => props.size.height}px;
  width: ${props => props.size.width}px;

`;

const Cell = styled.div<{ row: number, col: number, width: number, height: number }>`
  display: inline-block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  
  border-top: 0.5px solid black;

  &:nth-child(1) { 
    border-left: 0.5px solid black;
  }

  border-right: 0.5px solid black;

`;


const Row = styled.div<{ row: number, height: number }>`

  height: ${props => props.height}px;

  &:nth-last-child(-n+1) {
    border-bottom: 0.5px solid black;
  }
`;


export default Grid;
