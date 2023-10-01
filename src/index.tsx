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
import leftArrow from "./assets/left-arrow.svg";
import upArrow from "./assets/up-arrow.svg";
import downArrow from "./assets/down-arrow.svg";
import { theme } from "./theme";
import { PATH_ANIMATION_SPEED_SECONDS } from "./constants";

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

const getPathAnimation = (dir: "right" | "left" | "up" | "down" ) => keyframes`
  0% {
    background-image: url(${dir==="right" ? rightArrow : dir==="left" ? leftArrow : dir==="up" ? upArrow : downArrow});
    background-repeat: no-repeat;
    background-size: contain;
    scale: 0.7;
  }

  20% {
    scale: 0.3;
    background-image: none;
  }

  30% {
    border-radius: 50%;
  }

  100% {
    scale: 1;
    border-radius: 0;
  }
`;

const getVisitedAnimation = (props: ThemeProps<DefaultTheme>) => keyframes`
  0% {
    scale: 0.5;
    border: 0;
    background-color: ${props.theme.darkVisited};
  }

  50% {
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

  .path-right {
    background-color: ${(props) => props.theme.path};
    border: 0;
  }

  .path-left {
    background-color: ${(props) => props.theme.path};
    border: 0;
  }

  .path-up {
    background-color: ${(props) => props.theme.path};
    border: 0;
  }

  .path-down {
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

  .path-right.animate {
    animation: ${getPathAnimation("right")} ${PATH_ANIMATION_SPEED_SECONDS}s ease-in-out;
  }

  .path-left.animate {
    animation: ${getPathAnimation("left")} ${PATH_ANIMATION_SPEED_SECONDS}s ease-in-out;
  }

  .path-down.animate {
    animation: ${getPathAnimation("down")} ${PATH_ANIMATION_SPEED_SECONDS}s ease-in-out;
  }

  .path-up.animate {
    animation: ${getPathAnimation("up")} ${PATH_ANIMATION_SPEED_SECONDS}s ease-in-out;
  }

  .visited.animate {
    animation: ${getVisitedAnimation} 0.2s linear;
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
