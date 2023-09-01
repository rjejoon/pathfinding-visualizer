import ReactDOM from "react-dom/client";
import App from "./App";
import { Normalize } from "styled-normalize";
import { createGlobalStyle, keyframes } from "styled-components";
import destPin from "./assets/dest-pin.svg";
import rightArrow from "./assets/right-arrow.svg";

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

const visitedAnimation = keyframes`
  0% {
    scale: 0;
    border-radius: 50%;
    border: 0;
    background-color: #00008B
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
    background-color: #99e6ff; /* Original color */
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
    background-color: #163057;
  }

  .path {
    background-color: #ffff99;
    border: 0;
  }

  .visited {
    background-color: #99e6ff;
    border: 0.5px solid #cacaca;
  }

  .exploring {
    background-color: #ffff99;
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
    animation: ${visitedAnimation} 0.35s linear;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <Normalize />
    <GlobalStyle />
    <App />
  </>
);
