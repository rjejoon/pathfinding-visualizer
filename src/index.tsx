import ReactDOM from "react-dom/client";
import App from "./App";
import { Normalize } from "styled-normalize";
import { createGlobalStyle, keyframes } from "styled-components";

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
  }

  50% {
    scale: 0.5;
    border-radius: 50%;
    border: 0.5px solid black;
  }

  100% {
    scale: 1;
    border-radius: 0;
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
    background-color: #66ff66;
  }

  .dest {
    background-color: #ff6666;
  }

  .wall {
    background-color: #163057;
  }

  .path {
    background-color: #ffff99;
  }

  .visited {
    background-color: #99e6ff;
  }

  .source.animate {
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .dest.animate {
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .wall.animate {
    animation: ${visitedAnimation} 0.2s linear;
  }

  .path.animate {
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .visited.animate {
    animation: ${visitedAnimation} 0.7s linear;
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
