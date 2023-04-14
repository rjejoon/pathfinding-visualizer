import ReactDOM from "react-dom/client";
import App from "./App";
import { Normalize } from "styled-normalize";
import { createGlobalStyle } from "styled-components";

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
