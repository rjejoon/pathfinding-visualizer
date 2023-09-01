import ReactDOM from "react-dom/client";
import App from "./App";
import { Normalize } from "styled-normalize";
import {
  DefaultTheme,
  ThemeProps,
  ThemeProvider,
  createGlobalStyle,
  keyframes,
} from "styled-components";
import destPin from "./assets/dest-pin.svg";
import rightArrow from "./assets/right-arrow.svg";
import { theme } from "./theme";

const wallAnimation = keyframes`
  0% {
    scale: 1;
  }

  50% {
    scale: 1.3;
  }

  100% {
    scale: 1;
  }
`;

const getVisitedAnimation = (props: ThemeProps<DefaultTheme>) => keyframes`
  0% {
    scale: 0;
    border-radius: 50%;
    border: 0;
    background-color: ${props.theme.darkVisited};
  }

  50% {
    scale: 0.5;
    border-radius: 50%;
    border: 0;
  }

  100% {
    scale: 1;
    border-radius: 0;
    border: 0;
    background-color: ${props.theme.visited};
  }
`;

const shrinkAnimation = keyframes`
  0% {
    scale: 1;
  }

  50% {
    scale: 0;
  }

  100% {
    scale: 1;
  }
`;

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    width: 100%;
  }

  body {
    max-height: 100%;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }

  .source {
    background-image: url(${rightArrow});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }

  .dest {
    background-image: url(${destPin});
    background-repeat: no-repeat;
    background-size: contain;
  }

  .wall {
    background-color: ${(props) => props.theme.wall};
  }

  .path {
    background-color: ${(props) => props.theme.path};
    border: 0;
  }

  .visited {
    background-color: ${(props) => props.theme.visited};
    border: 0.5px solid #cacaca;
  }

  .source.animate {
    animation: ${shrinkAnimation} 0.2s linear;
  }

  .dest.animate {
    animation: ${shrinkAnimation} 0.2s linear;
  }

  .wall.animate {
    animation: ${wallAnimation} 0.2s linear;
  }

  .path.animate {
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .visited.animate {
    animation: ${getVisitedAnimation} 0.35s linear;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <ThemeProvider theme={theme}>
      <Normalize />
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </>
);
