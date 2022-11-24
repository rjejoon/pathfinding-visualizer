import bfs from './algorithms/bfs';
import { Vertex, Visualizer } from './types';

type PathfindingAlgorithms = {
  [algoValue: string]: (grid: Vertex[][]) => Visualizer | null
}

const pathfindingAlgorithms: PathfindingAlgorithms = {
  "bfs": bfs,
}

export default pathfindingAlgorithms;