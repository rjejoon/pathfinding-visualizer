import { MazeAndPatternVisualizer } from "../../../types";
import { Vertex } from "../../vertex";
import _ from "lodash";

/**
 * Randomly generate walls in the grid
 * @param grid Vertex[][]
 * @returns MazeAndPatternVisualizer
 */
export default function randomWalls(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const threshold = 0.2;

  let visitedVerticesInOrder: Vertex[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (Math.random() < threshold) {
        visitedVerticesInOrder.push(grid[r][c]);
      }
    }
  }

  visitedVerticesInOrder = _.shuffle(visitedVerticesInOrder);
  return { visitedVerticesInOrder };
}
