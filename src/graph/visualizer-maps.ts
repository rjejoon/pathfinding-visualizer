import { MazeAndPatternOptions, MazeAndPatternVisualizer } from "../types";
import bfs from "./algorithms/bfs";
import dfs from "./algorithms/dfs";
import dijkstra from "./algorithms/dijkstra";
import astar from "./algorithms/astar";
import {
  PathfindingAlgoOptions,
  PathfindingVisualizer,
  Vertex,
} from "../types";
import recursiveMaze from "./algorithms/mazes/recursive-maze";

type PathfindingVisualizerMap = {
  [key in PathfindingAlgoOptions]: (
    grid: Vertex[][]
  ) => PathfindingVisualizer | null;
};

type MazeAndPatternVisualizerMap = {
  [key in MazeAndPatternOptions]: (
    grid: Vertex[][]
  ) => MazeAndPatternVisualizer | null;
};
export const pathfindingVisualizers: PathfindingVisualizerMap = {
  bfs: bfs,
  dfs: dfs,
  dijkstra: dijkstra,
  astar: astar,
};

export const mazeAndPatternVisualizers: MazeAndPatternVisualizerMap = {
  "recursive-maze": recursiveMaze,
};
