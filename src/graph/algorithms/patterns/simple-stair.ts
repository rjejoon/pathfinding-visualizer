import { MazeAndPatternVisualizer } from "../../../types";
import { Vertex } from "../../vertex";

/**
 * Create a simple stair pattern.
 * @param grid Vertex[][]
 * @returns MazeAndPatternVisualizer
 */
export default function simpleStair(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const visitedVerticesInOrder: Vertex[] = [];

  let r = grid.length - 1;
  let c = 0;
  while (r >= 0 && c < grid[0].length) {
    visitedVerticesInOrder.push(grid[r][c]);
    r--;
    c++;
  }

  if (c >= grid[0].length) {
    // make one exit
    visitedVerticesInOrder.splice(visitedVerticesInOrder.length - 1, 1);
    return { visitedVerticesInOrder };
  }

  r++;
  c--;
  while (r < grid.length - 1 && c < grid[0].length) {
    visitedVerticesInOrder.push(grid[r][c]);
    r++;
    c++;
  }

  if (c >= grid[0].length) {
    // make one exit
    visitedVerticesInOrder.splice(visitedVerticesInOrder.length - 1, 1);
    return { visitedVerticesInOrder };
  }

  r -= 2;
  while (r >= 0 && c < grid[0].length - 1) {
    visitedVerticesInOrder.push(grid[r][c]);
    r--;
    c++;
  }

  return { visitedVerticesInOrder };
}
