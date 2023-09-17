import { getSourceAndDest } from "../../../grid";
import { MazeAndPatternVisualizer, Vertex } from "../../../types";

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
  }
  for (let r = 0; r < grid.length; r++) {
    visitedVerticesInOrder.push(grid[r][grid[0].length - 1]);
    walls[r][grid[0].length - 1] = true;
  }
  for (let c = grid[0].length - 1; c >= 0; c--) {
    visitedVerticesInOrder.push(grid[grid.length - 1][c]);
    walls[grid.length - 1][c] = true;
  }
  for (let r = grid.length - 1; r >= 0; r--) {
    visitedVerticesInOrder.push(grid[r][0]);
    walls[r][0] = true;
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

    // wall point
    // wall points cannot be on the same row or column as the source or dest
    // wall points cannot be adjacent to walls that are already there
    // wall points cannot be adjacent to passage points
    let wx: number;
    let wy: number;
    while (true) {
      const possible_wxs: number[] = [];
      const possible_wys: number[] = [];
      if (isHorizontal) {
        wx = x;
        for (let i = y + 1; i < y + height; i += 2) {
          possible_wys.push(i);
        }
        wy = possible_wys[Math.floor(Math.random() * possible_wys.length)];
      } else {
        wy = y;
        for (let i = x + 1; i < x + width; i += 2) {
          possible_wxs.push(i);
        }
        wx = possible_wxs[Math.floor(Math.random() * possible_wxs.length)];
      }

      const isWallPointOnSource = wx === source.col || wy === source.row;
      const isWallPointOnDest = wx === dest.col || wy === dest.row;
      const isWallPointAdjacentToWall = isHorizontal
        ? walls[wy + 1][wx] || walls[wy - 1][wx]
        : walls[wy][wx - 1] || walls[wy][wx + 1];
      const isWallPointAdjacentToPassage = isHorizontal
        ? !walls[wy][x - 1] || !walls[wy][wx + 1]
        : !walls[y - 1][wx] || !walls[wy + 1][wx];

      if (
        !isWallPointOnSource &&
        !isWallPointOnDest &&
        !isWallPointAdjacentToWall &&
        !isWallPointAdjacentToPassage
      ) {
        break;
      }
      console.log(wx, wy);
    }

    // do {
    //   if (isHorizontal) {
    //     wx = x;
    //     for (let i = y + 1; i < y + height; i += 2) {
    //       possible_wys.push(i);
    //     }
    //     wy = possible_wys[Math.floor(Math.random() * possible_wys.length)];
    //   } else {
    //     wy = y;
    //     for (let i = x + 1; i < x + width; i += 2) {
    //       possible_wxs.push(i);
    //     }
    //     wx = possible_wxs[Math.floor(Math.random() * possible_wxs.length)];
    //   }
    // } while (
    //   wx === source.col &&
    //   wx === dest.col &&
    //   wy === source.row &&
    //   wy === dest.row &&
    //   (isHorizontal
    //     ? !walls[wy][wx - 1] || !walls[wy][wx + 1]
    //     : !walls[wy - 1][wx] || !walls[wy + 1][wx])
    // );

    // passage point
    const px = wx + (isHorizontal ? Math.floor(Math.random() * width) : 0);
    const py = wy + (isHorizontal ? 0 : Math.floor(Math.random() * height));

    // direction
    const dx = isHorizontal ? 1 : 0;
    const dy = isHorizontal ? 0 : 1;

    const wallLength = isHorizontal ? width : height;

    for (let i = 0; i < wallLength; i++) {
      if (wx !== px || wy !== py) {
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
  } else if (height < width) {
    return 1;
  }
  return Math.floor(Math.random() * 2);
}

function isSurroundedByWalls(
  walls: boolean[][],
  x: number,
  y: number,
  width: number,
  height: number
) {
  return (
    (walls[y][x - 1] && walls[y][x + 1]) || (walls[y - 1][x] && walls[y + 1][x])
  );
}
