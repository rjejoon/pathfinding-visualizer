import Queue from 'queue-fifo';

import { Vertex, Coord, PathfindingVisualizer } from '../../types';
import { getSourceAndDest } from '../../grid';


export default function bfs(grid: Vertex[][]): PathfindingVisualizer | null {
  const visited: boolean[][] = new Array(grid.length).fill(false).map(() => new Array(grid[0].length).fill(false));
  const parents: Vertex[][] = new Array(grid.length).fill(undefined).map(() => new Array(grid[0].length).fill(undefined));

  const [source, dest] = getSourceAndDest(grid);
  const queue = new Queue<Vertex>();
  const visitedVerticesInOrder: Vertex[] = [];

  queue.enqueue(source);
  visited[source.row][source.col] = true;

  while (!queue.isEmpty()) {
    const v = queue.dequeue();

    if (!v) {
      return null;
    }

    const neighs = [
      new Coord(v.row - 1, v.col),  // up
      new Coord(v.row, v.col + 1),  // right
      new Coord(v.row + 1, v.col),  // bottom
      new Coord(v.row, v.col - 1),  // left
    ].filter(({ row, col }) => (0 <= row && row < grid.length) && (0 <= col && col < grid[0].length))
      .map(({ row, col }) => grid[row][col])
      .filter(v => v.isValid());

    for (const u of neighs) {
      if (visited[u.row][u.col] === false) {
        queue.enqueue(u);
        visited[u.row][u.col] = true;
        visitedVerticesInOrder.push(u);
        parents[u.row][u.col] = v;
      }
      if (u.isEqual(dest)) {
        return { visitedVerticesInOrder, parents, source, dest };
      }
    }
  }
  return { visitedVerticesInOrder, parents, source, dest };
}