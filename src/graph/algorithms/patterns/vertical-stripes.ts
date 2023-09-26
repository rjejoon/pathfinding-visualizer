import { MazeAndPatternVisualizer, Vertex } from "../../../types";
import _ from "lodash";

/**
 * Create a vertical stripes pattern.
 * @param grid Vertex[][]
 * @returns MazeAndPatternVisualizer
 */
export default function verticalStripes(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const visitedVerticesInOrder: Vertex[] = [];

  for (let c = 0; c < grid[0].length; c += 3) {
    const walls: Vertex[] = [];
    for (let r = 0; r < grid.length; r++) {
      if (grid[r][c].isSource || grid[r][c].isDest) continue;
      walls.push(grid[r][c]);
    }
    walls.splice(_.random(0, walls.length - 1), 1);
    visitedVerticesInOrder.push(...walls);
  }

  return { visitedVerticesInOrder };
}
