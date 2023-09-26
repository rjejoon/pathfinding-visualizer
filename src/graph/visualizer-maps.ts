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
import recursiveDivision from "./algorithms/mazes/recursive-division";
import simpleStair from "./algorithms/patterns/simple-stair";
import randomWalls from "./algorithms/mazes/random-walls";
import concentricCircles from "./algorithms/patterns/concentric-circles";
import diagonalLine from "./algorithms/patterns/diagonal-line";
import verticalStripes from "./algorithms/patterns/vertical-stripes";

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
  "recursive-division": recursiveDivision,
  "simple-stair": simpleStair,
  "random-walls": randomWalls,
  "concentric-circles": concentricCircles,
  "diagonal-line": diagonalLine,
  "vertical-stripes": verticalStripes,
};
