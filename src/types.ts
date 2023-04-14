import Coord from "./graph/coord";
import { Vertex } from "./graph/vertex";

export interface Visualizer {
  visitedVerticesInOrder: Vertex[];
  parents: Vertex[][];
  source: Vertex;
  dest: Vertex;
}

export type VisualizeState = 'idle' | 'running' | 'finished' 
export type VisualizeStateReducerAction = {
  type: 'idle' | 'running' | 'finished'
}

export type GraphAlgoOptions = 'dfs' | 'bfs' | 'dijkstra' | 'a-star';
export { Vertex, Coord };

