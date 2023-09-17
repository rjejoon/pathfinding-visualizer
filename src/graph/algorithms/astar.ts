import { Vertex, Coord, PathfindingVisualizer } from '../../types';
import { getSourceAndDest } from '../../grid';
import { IGetCompareValue, MinPriorityQueue } from '@datastructures-js/priority-queue';

interface IVertexFscore {
  vertex: Vertex;
  f: number;
}

/**
 * Uses Manhattan distance 
 * @param u Vertex
 * @param v Vertex
 * @returns number
 */
function heuristic(u: Vertex, v: Vertex) {
  return Math.abs(u.row - v.row) + Math.abs(u.col - v.col);
}

export default function astar(grid: Vertex[][]): PathfindingVisualizer | null {

  const [source, dest] = getSourceAndDest(grid);
  const parents: Vertex[][] = new Array(grid.length).fill(undefined).map(() => new Array(grid[0].length).fill(undefined));
  const visitedVerticesInOrder: Vertex[] = [];
  const getMinFscore: IGetCompareValue<IVertexFscore> = ({ f }) => f;
  const openSet = new MinPriorityQueue<IVertexFscore>(getMinFscore);
  openSet.enqueue({ vertex: source, f: 0 });

  const gScores: number[][] = new Array(grid.length).fill(Infinity).map(() => new Array(grid[0].length).fill(Infinity));
  gScores[source.row][source.col] = 0;
  const fScores: number[][] = new Array(grid.length).fill(Infinity).map(() => new Array(grid[0].length).fill(Infinity));
  fScores[source.row][source.col] = heuristic(source, dest);

  while (!openSet.isEmpty()) {
    const { vertex: u } = openSet.dequeue();

    if (u.isEqual(dest)) {
      return { visitedVerticesInOrder, parents, source, dest };
    }

    const neighs = [
      new Coord(u.row - 1, u.col),  // up
      new Coord(u.row, u.col + 1),  // right
      new Coord(u.row + 1, u.col),  // bottom
      new Coord(u.row, u.col - 1),  // left
    ].filter(({ row, col }) => (0 <= row && row < grid.length) && (0 <= col && col < grid[0].length))
      .map(({ row, col }) => grid[row][col])
      .filter(v => v.isValid());

    for (const v of neighs) {
      const tentGscore = gScores[u.row][u.col] + v.weight;
      if (tentGscore < gScores[v.row][v.col]) {
        visitedVerticesInOrder.push(v);
        gScores[v.row][v.col] = tentGscore;
        fScores[v.row][v.col] = tentGscore + heuristic(v, dest);
        parents[v.row][v.col] = u;
        openSet.enqueue({ vertex: v, f: fScores[v.row][v.col] });
      }
    }
  }
  return { visitedVerticesInOrder, parents, source, dest };
}