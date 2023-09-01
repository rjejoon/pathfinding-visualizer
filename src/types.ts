import Coord from "./graph/coord";
import { Vertex } from "./graph/vertex";

export interface Visualizer {
  visitedVerticesInOrder: Vertex[];
  parents: Vertex[][];
  source: Vertex;
  dest: Vertex;
}

export type VisualizeState = 'idle' | 'running' | 'finished' 

export type VisualizationConfig = {
  algo: GraphAlgoOptions;
  animationSpeed: number;
  isAnimationEnabled: boolean;
}

export type GraphAlgoOptions = 'dfs' | 'bfs' | 'dijkstra' | 'astar';
export { Vertex, Coord };

