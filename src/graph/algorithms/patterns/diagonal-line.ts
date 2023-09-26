import { MazeAndPatternVisualizer } from "../../../types";
import { Vertex } from "../../vertex";
import _ from "lodash";

/**
 * Create a diagonal line from top left to bottom right corner.
 * Uses Bresenham's line algorithm.
 *
 * @param grid Vertex[][]
 * @returns MazeAndPatternVisualizer
 */
export default function diagonalLine(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const visitedVerticesInOrder: Vertex[] = [];

  const width = grid[0].length;
  const height = grid.length;
  let x0 = 0,
    y0 = 0,
    x1 = width - 1,
    y1 = height - 1;

  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;

  let err = dx - dy;

  while (true) {
    visitedVerticesInOrder.push(grid[y0][x0]);

    if (x0 === x1 && y0 === y1) {
      break;
    }

    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  // remove one vertex to make an exit
  visitedVerticesInOrder.splice(
    _.random(0, visitedVerticesInOrder.length - 1),
    1
  );

  return { visitedVerticesInOrder };
}
