import ReactDOM from "react-dom/client";
import App from "./App";
import { Normalize } from "styled-normalize";
import { createGlobalStyle, keyframes } from "styled-components";

const wallAnimation = keyframes`
  0% {
    border: none;
    scale: 1
  }

  50% {
    border: none;
    scale: 1.3
  }

  100% {
    border: none;
    scale: 1
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
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .dest {
    background-color: #ff6666;
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .wall {
    background-color: #163057;
    // scale background node if the node is a wall
    animation: ${wallAnimation} 0.2s ease-in-out;
  }

  .path {
    background-color: #ffff99;
  }

  .visited {
    background-color: #99e6ff;
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
