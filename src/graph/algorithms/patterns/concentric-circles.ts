import { MazeAndPatternVisualizer } from "../../../types";
import { Vertex } from "../../vertex";

/**
 * Create concentric circles.
 * @param grid Vertex[][]
 * @returns MazeAndPatternVisualizer
 */
export default function concentricCircles(
  grid: Vertex[][]
): MazeAndPatternVisualizer {
  const visitedVerticesInOrder: Vertex[] = [];

  const circleCount = 5;
  const radius = Math.min(grid.length, grid[0].length) / 2;
  const radiusStep = radius / circleCount;
  const centerR = Math.floor(grid.length / 2);
  const centerC = Math.floor(grid[0].length / 2);

  for (let i = 0; i < circleCount; i++) {
    for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
      const r = Math.floor(
        centerR + (radius - i * radiusStep) * Math.cos(angle)
      );
      const c = Math.floor(
        centerC + (radius - i * radiusStep) * Math.sin(angle)
      );
      if (
        r < 0 ||
        r >= grid.length ||
        c < 0 ||
        c >= grid[0].length ||
        grid[r][c].isSource ||
        grid[r][c].isDest
      )
        continue;

      visitedVerticesInOrder.push(grid[r][c]);
    }
  }
  // remove some walls to ensure there is a path
  const numWallsToRemove = Math.floor(visitedVerticesInOrder.length * 0.8);
  for (let i = 0; i < numWallsToRemove; i++) {
    const randIdx = Math.floor(Math.random() * visitedVerticesInOrder.length);
    visitedVerticesInOrder.splice(randIdx, 1);
  }
  return { visitedVerticesInOrder };
}
