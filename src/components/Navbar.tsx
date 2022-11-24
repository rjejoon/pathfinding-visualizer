import styled from 'styled-components';


interface NavbarStyle {
  $height: number;
}

interface NavbarProps {
  navbarStyle: NavbarStyle;
  algoValue: string;
  changeAlgoOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  visualizeOnClick: () => void;
  resetGridOnClick: () => void;
}


export default function Navbar({ navbarStyle, algoValue, changeAlgoOnChange, visualizeOnClick, resetGridOnClick }: NavbarProps) {
  return (
    <StyledNav $height={navbarStyle.$height}>
      <AlgoSelect value={algoValue} onChange={changeAlgoOnChange}>
        <option value="bfs">Breath First Search</option>
        <option value="dfs">Depth First Search</option>
        <option value="dijkstra">Dijkstra's</option>
      </AlgoSelect>
      <VisualizeButton onClick={visualizeOnClick}>Start</VisualizeButton>
      <ResetButton onClick={resetGridOnClick}>Reset</ResetButton>

    </StyledNav >
  );
};

const AlgoSelect = styled.select`
  
`;

const StyledNav = styled.nav<NavbarStyle>`
  height: ${props => props.$height}px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualizeButton = styled.button`
  height: 42px;
  min-width: 150px;
`

const ResetButton = styled.button`
  height: 42px;
  min-width: 100px;
`