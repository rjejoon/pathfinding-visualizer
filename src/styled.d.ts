import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    wall: string;
    path: string;
    visited: string;
    darkVisited: string;
    border: string;
  }
}