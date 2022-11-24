import bfs from './algorithms/bfs';
import dfs from './algorithms/dfs';
import { Vertex, Visualizer } from './types';

type PathfindingAlgorithms = {
  [algoValue: string]: (grid: Vertex[][]) => Visualizer | null
}

const pathfindingAlgorithms: PathfindingAlgorithms = {
  "bfs": bfs,
  "dfs": dfs,
}

export default pathfindingAlgorithms;