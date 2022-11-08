import styled from 'styled-components';


const Navbar: React.FC<{ height: number }> = (props) => {
  return (
    <StyledNav height={props.height}>

    </StyledNav >
  );
};

const StyledNav = styled.nav<{ height: number }>`
  height: ${props => props.height}px;
  background-color: gray;

`;

export default Navbar;