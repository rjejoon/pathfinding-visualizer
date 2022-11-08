import ReactDOM from 'react-dom/client';
import App from './App';
import { Normalize } from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  :root {
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <Normalize />
    <GlobalStyle />
    <App />
  </>
);
