import styled from 'styled-components';


interface NavbarStyleProps {
  $height: number;

}
interface NavbarProps extends NavbarStyleProps {
  handleClick: () => void;
}


const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <StyledNav $height={props.$height}>
      <Button onClick={props.handleClick}>Start</Button>

    </StyledNav >
  );
};

const StyledNav = styled.nav<NavbarStyleProps>`
  height: ${props => props.$height}px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  height: 42px;
  min-width: 150px;
`
export default Navbar;