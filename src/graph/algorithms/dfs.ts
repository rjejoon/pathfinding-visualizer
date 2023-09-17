import { Vertex, Coord, PathfindingVisualizer } from '../../types';
import { getSourceAndDest } from '../../grid';


export default function dfs(grid: Vertex[][]): PathfindingVisualizer | null {
  const visited: boolean[][] = new Array(grid.length).fill(false).map(() => new Array(grid[0].length).fill(false));
  const parents: Vertex[][] = new Array(grid.length).fill(undefined).map(() => new Array(grid[0].length).fill(undefined));

  const [source, dest] = getSourceAndDest(grid);
  const visitedVerticesInOrder: Vertex[] = [];

  function dfsHelper(v: Vertex): boolean {
    visited[v.row][v.col] = true;
    visitedVerticesInOrder.push(v);

    if (v.isEqual(dest)) {
      return true;
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
        parents[u.row][u.col] = v;
        const foundDest = dfsHelper(u);
        if (foundDest) {
          return true;
        }
      }
    }

    return false;
  }

  dfsHelper(source);
  return { visitedVerticesInOrder, parents, source, dest };
}