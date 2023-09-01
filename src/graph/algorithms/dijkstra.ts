import { Vertex, Coord, Visualizer } from '../../types';
import { getSourceAndDest } from '../../grid';
import { IGetCompareValue, MinPriorityQueue } from '@datastructures-js/priority-queue';

interface IVertexDist {
  vertex: Vertex;
  dist: number;
}

export default function dijkstra(grid: Vertex[][]): Visualizer | null {
  const [source, dest] = getSourceAndDest(grid);

  const parents: Vertex[][] = new Array(grid.length).fill(undefined).map(() => new Array(grid[0].length).fill(undefined));
  const visitedVerticesInOrder: Vertex[] = [];

  const getVertexValue: IGetCompareValue<IVertexDist> = ({ dist }) => dist;
  const pq = new MinPriorityQueue<IVertexDist>(getVertexValue);
  pq.enqueue({ vertex: source, dist: 0 })

  const dist: number[][] = new Array(grid.length).fill(Infinity).map(() => new Array(grid[0].length).fill(Infinity));

  dist[source.row][source.col] = 0;

  while (!pq.isEmpty()) {
    const {vertex: v} = pq.dequeue();

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
      if (dist[u.row][u.col] > dist[v.row][v.col] + u.weight) {
        dist[u.row][u.col] = dist[v.row][v.col] + u.weight;
        pq.enqueue({ vertex: u, dist: dist[u.row][u.col] });
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