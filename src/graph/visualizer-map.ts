import bfs from './algorithms/bfs';
import dfs from './algorithms/dfs';
import { GraphAlgoOptions, Vertex, Visualizer } from '../types';

type GraphAlgoToVisualizerMap = {
  [key in GraphAlgoOptions]: (grid: Vertex[][]) => Visualizer | null
}

const algoVisualizers: GraphAlgoToVisualizerMap = {
  "bfs": bfs,
  "dfs": dfs,
  'dijkstra': () => null,
  'a-star': () => null,
}

export default algoVisualizers;