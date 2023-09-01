import bfs from './algorithms/bfs';
import dfs from './algorithms/dfs';
import dijkstra from './algorithms/dijkstra';
import { GraphAlgoOptions, Vertex, Visualizer } from '../types';

type GraphAlgoToVisualizerMap = {
  [key in GraphAlgoOptions]: (grid: Vertex[][]) => Visualizer | null
}

const algoVisualizers: GraphAlgoToVisualizerMap = {
  "bfs": bfs,
  "dfs": dfs,
  'dijkstra': dijkstra,
  'a-star': () => null,
}

export default algoVisualizers;