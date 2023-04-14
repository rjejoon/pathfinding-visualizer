import { Vertex, Coord } from './types';

/**
 * Creates numRow x numCol grid initialized with Vertex objects.
 * Source and destination vertices are initialized here.
 * 
 * @param numRow - number of rows in grid
 * @param numCol - number of cols in grid
 * @returns grid
 */
export function initGrid(numRow: number, numCol: number): Vertex[][] {
  const source: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.20));
  const dest: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.80));

  const grid: Vertex[][] = [];
  for (let r = 0; r < numRow; r++) {
    const row: Vertex[] = [];
    for (let c = 0; c < numCol; c++) {
      const v = new Vertex(r, c);
      v.isSource = (r === source.row && c === source.col);
      v.isDest = (r === dest.row && c === dest.col);
      row.push(v);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Returns source and dest Verticies from the grid.
 * @param grid - 2d array of Vertex
 * @returns a tuple of source and dest vertices
 */
export function getSourceAndDest(grid: Vertex[][]): [Vertex, Vertex] {
  let source: Vertex = new Vertex(-1, -1);
  let dest: Vertex = new Vertex(-1, -1);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].isSource) {
        source = grid[r][c];
      } else if (grid[r][c].isDest) {
        dest = grid[r][c];
      }
    }
  }

  if (source.row < 0 || source.col < 0 || dest.row < 0 || dest.col < 0) {
    console.error("source or dest is not valid");
  }

  return [source, dest];
}

export function resetWallAndVisited(grid: Vertex[][]) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      grid[r][c].isVisited = false;
      grid[r][c].isPath = false;
    }
  }
}