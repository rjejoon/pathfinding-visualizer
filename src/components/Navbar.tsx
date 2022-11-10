import styled from 'styled-components';


interface NavbarStyle {
  $height: number;
}

interface NavbarProps {
  navbarStyle: NavbarStyle;
  handleClick: () => void;
}


export default function Navbar({ navbarStyle, handleClick }: NavbarProps) {
  return (
    <StyledNav $height={navbarStyle.$height}>
      <Button onClick={handleClick}>Start</Button>

    </StyledNav >
  );
};

const StyledNav = styled.nav<NavbarStyle>`
  height: ${props => props.$height}px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  height: 42px;
  min-width: 150px;
`