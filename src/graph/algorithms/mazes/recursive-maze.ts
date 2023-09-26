import { getSourceAndDest } from "../../../grid";
import { MazeAndPatternVisualizer, Vertex } from "../../../types";
import _ from "lodash";

export default function recursiveMaze(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const walls: boolean[][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length).fill(false));

  const visitedVerticesInOrder: Vertex[] = [];

  // set up outer walls
  for (let c = 0; c < grid[0].length; c++) {
    visitedVerticesInOrder.push(grid[0][c]);
    walls[0][c] = true;
    visitedVerticesInOrder.push(grid[grid.length - 1][grid[0].length - 1 - c]);
    walls[grid.length - 1][grid[0].length - 1 - c] = true;
  }
  for (let r = 0; r < grid.length; r++) {
    visitedVerticesInOrder.push(grid[r][grid[0].length - 1]);
    walls[r][grid[0].length - 1] = true;
    visitedVerticesInOrder.push(grid[grid.length - 1 - r][0]);
    walls[grid.length - 1 - r][0] = true;
  }

  const [source, dest] = getSourceAndDest(grid);

  function recurse(
    x: number,
    y: number,
    width: number,
    height: number,
    orientation: number
  ) {
    if (
      // isSurroundedByWalls(walls, x, y, width, height) ||
      width <= 1 ||
      height <= 1
    ) {
      return;
    }

    const isHorizontal = orientation === 0;

    /**
     * wall point constraints:
     *   - wall points cannot be on the same row or column as the source or dest
     *   - wall points cannot be adjacent to walls that are already there
     *   - wall points cannot be adjacent to passage points
     */
    let wx: number;
    let wy: number;
    const possible_wxs: number[] = [];
    const possible_wys: number[] = [];
    if (isHorizontal) {
      wx = x;
      for (let wy = y + 1; wy < y + height; wy += 2) {
        const isWallPointAdjacentToWall =
          walls[wy + 1][wx] || walls[wy - 1][wx];
        const isWallPointAdjacentToPassage =
          !walls[wy][wx - 1] || !walls[wy][wx + width];
        if (isWallPointAdjacentToWall || isWallPointAdjacentToPassage) continue;
        possible_wys.push(wy);
      }
      if (possible_wys.length === 0) {
        return;
      }
      wy = possible_wys[Math.floor(Math.random() * possible_wys.length)];
    } else {
      wy = y;
      for (let wx = x + 1; wx < x + width; wx += 2) {
        const isWallPointAdjacentToWall =
          walls[wy][wx - 1] || walls[wy][wx + 1];
        const isWallPointAdjacentToPassage =
          !walls[wy - 1][wx] || !walls[wy + height][wx];
        if (isWallPointAdjacentToWall || isWallPointAdjacentToPassage) continue;
        possible_wxs.push(wx);
      }
      if (possible_wxs.length === 0) {
        return;
      }
      wx = possible_wxs[Math.floor(Math.random() * possible_wxs.length)];
    }

    // passage point
    let px: number;
    let py: number;

    if (isHorizontal) {
      py = wy;
      const possible_pxs = _.range(wx, wx + width, 2);
      px = possible_pxs[_.random(0, possible_pxs.length - 1)];
    } else {
      px = wx;
      const possible_pys = _.range(wy, wy + height, 2);
      py = possible_pys[_.random(0, possible_pys.length - 1)];
    }

    // direction
    const dx = isHorizontal ? 1 : 0;
    const dy = isHorizontal ? 0 : 1;

    const wallLength = isHorizontal ? width : height;

    for (let i = 0; i < wallLength; i++) {
      if (
        !(
          (wx === px && wy === py) ||
          (wx === source.col && wy === source.row) ||
          (wx === dest.col && wy === dest.row)
        )
      ) {
        visitedVerticesInOrder.push(grid[wy][wx]);
        walls[wy][wx] = true;
      }
      wx += dx;
      wy += dy;
    }

    let nx = x;
    let ny = y;
    let w = isHorizontal ? width : wx - x;
    let h = isHorizontal ? wy - y : height;
    recurse(nx, ny, w, h, choose_orientation(w, h));

    nx = isHorizontal ? x : wx + 1;
    ny = isHorizontal ? wy + 1 : y;
    w = isHorizontal ? width : x + width - wx - 1;
    h = isHorizontal ? y + height - wy - 1 : height;
    recurse(nx, ny, w, h, choose_orientation(w, h));
  }

  recurse(
    1,
    1,
    grid[0].length - 2,
    grid.length - 2,
    choose_orientation(grid[0].length - 2, grid.length - 2)
  );

  return { visitedVerticesInOrder };
}

/**
 * Choose a random orientation for the wall
 * @param width number
 * @param height number
 * @returns 0: horizontal, 1: vertical
 */
function choose_orientation(width: number, height: number) {
  if (width < height) {
    return 0;
  } else if (width > height) {
    return 1;
  }
  return Math.floor(Math.random() * 2);
}
