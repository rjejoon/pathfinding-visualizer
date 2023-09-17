import Coord from "./graph/coord";
import { Vertex } from "./graph/vertex";

export interface Visualizer {
  visitedVerticesInOrder: Vertex[];
}

export type MazeAndPatternVisualizer = Visualizer;

export interface PathfindingVisualizer extends Visualizer {
  parents: Vertex[][];
  source: Vertex;
  dest: Vertex;
}

export type VisualizeState = "idle" | "running" | "finished";

export type VisualizationConfig = {
  algo: PathfindingAlgoOptions;
  animationSpeed: number;
  isAnimationEnabled: boolean;
};

export type PathfindingAlgoOptions = "dfs" | "bfs" | "dijkstra" | "astar";
export type MazeAndPatternOptions = "recursive-maze";

export { Vertex, Coord };
