import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import Grid from "./components/Grid";

import {
  GraphAlgoOptions,
  Vertex,
  VisualizationConfig,
  VisualizeState,
} from "./types";
import { initGrid, resetWallAndVisited } from "./grid";
import algoVisualizers from "./graph/visualizer-map";
import useWindowSize from "./hooks/use-window-size";
import { VisualizeStateContext } from "./context/VisualizeStateContext";

const DESIRED_DIM = 25;

export default function App() {
  const windowSize = useWindowSize();
  const navbarHeight = 70;

  const gridWidth = windowSize.width || 0;
  const gridHeight = (windowSize.height || 0) - navbarHeight;

  let w = DESIRED_DIM;
  let h = DESIRED_DIM;
  const numRow = Math.floor(gridHeight / DESIRED_DIM);
  const numCol = Math.floor(gridWidth / DESIRED_DIM);

  // adjust width and height
  w += (gridWidth - numCol * w) / numCol - 0.01;
  h += (gridHeight - numRow * h) / numRow - 0.01;

  const gridRef = useRef(initGrid(numRow, numCol));
  const [visualizationConfig, setVisualizationConfig] =
    useState<VisualizationConfig>({
      algo: "bfs",
      animationSpeed: 3,
    });
  const [, setNow] = useState(new Date()); // used to force deep re-rendering
  const [visualizeState, setVisualizeState] = useState<VisualizeState>("idle");
  const [startVisualize, setStartVisualize] = useState(false);

  const resetGrid = useCallback(() => {
    gridRef.current = initGrid(numRow, numCol);
    setVisualizeState("idle");
    forceDeepRender();
  }, [numRow, numCol]);

  function resetVisualize() {
    resetWallAndVisited(gridRef.current);
    setVisualizeState("idle");
    forceDeepRender();
  }

  /**
   * Force deep re-rendering.
   */
  function forceDeepRender() {
    setNow(new Date());
  }

  const animatePath = useCallback(
    (parents: Vertex[][], source: Vertex, dest: Vertex) => {
      const parentPromises: Promise<number>[] = [];

      function animatePathHelper(v: Vertex) {
        if (v === undefined) {
          return -1;
        }
        let i = 0;
        if (!v.isEqual(source)) {
          i = animatePathHelper(parents[v.row][v.col]);
        }

        if (visualizeState === "finished") {
          gridRef.current[v.row][v.col].isPath = true;
          return i + 1;
        }

        parentPromises.push(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              gridRef.current[v.row][v.col].isPath = true;
              resolve(i);
            }, visualizationConfig.animationSpeed * 2 * i);
          })
        );
        return i + 1;
      }

      animatePathHelper(dest);
      return parentPromises;
    },
    [visualizationConfig.animationSpeed, visualizeState]
  );

  /**
   * Visualize the selected algorithm.
   */
  const visualize = useCallback(async () => {
    if (!(visualizationConfig.algo in algoVisualizers)) {
      console.error(`Error: Invalid algoValue: ${visualizationConfig.algo}`);
      return;
    }

    if (visualizeState === "running") {
      // prevent multiple visualizations
      return;
    }

    if (visualizeState === "idle") {
      setVisualizeState("running");
    }

    // reset visited and path nodes
    for (let r = 0; r < gridRef.current.length; r++) {
      for (let c = 0; c < gridRef.current[0].length; c++) {
        gridRef.current[r][c].isVisited = false;
        gridRef.current[r][c].isPath = false;
      }
    }

    const visualizer = algoVisualizers[visualizationConfig.algo](
      gridRef.current
    );

    console.log(visualizeState);
    if (visualizer === null) {
      console.error(`Error: ${visualizationConfig.algo} failed`);
      setVisualizeState("finished");
      return;
    }

    const { visitedVerticesInOrder, parents, source, dest } = visualizer;

    const visitPromises: Promise<number>[] = [];

    for (let i = 0; i < visitedVerticesInOrder.length; i++) {
      const targetV = visitedVerticesInOrder[i];
      if (visualizeState === "finished") {
        gridRef.current[targetV.row][targetV.col].isVisited = true;
      } else {
        visitPromises.push(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              gridRef.current[targetV.row][targetV.col].isVisited = true;
              resolve(i);
            }, visualizationConfig.animationSpeed * i);
          })
        );
      }
    }

    await Promise.all(visitPromises);
    await Promise.all(animatePath(parents, source, dest));
    setVisualizeState("finished");
  }, [
    animatePath,
    visualizationConfig.algo,
    visualizationConfig.animationSpeed,
    visualizeState,
  ]);

  function changeAlgoOptionOnChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (visualizeState === "running") {
      // prevent changing algo while visualizing
      return;
    }

    setVisualizationConfig((prev) => ({
      ...prev,
      algo: event.target.value as GraphAlgoOptions,
    }));
    resetVisualize();
  }

  useEffect(() => {
    // reset grid on resize
    resetGrid();
  }, [numRow, numCol, resetGrid]);

  useEffect(() => {
    // Visualize on startVisualize
    // Need it in useEffect so that visualize gets the latest visualizeState
    if (startVisualize) {
      visualize();
      setStartVisualize(false);
    }
  }, [startVisualize, visualize]);

  return (
    <VisualizeStateContext.Provider value={visualizeState}>
      <Navbar
        navbarStyle={{ $height: navbarHeight }}
        algoValue={visualizationConfig.algo}
        changeAlgoOnChange={changeAlgoOptionOnChange}
        visualizeOnClick={() => {
          if (visualizeState === "finished") {
            resetVisualize();
          }
          setStartVisualize(true);
        }}
        resetGridOnClick={() => {
          if (visualizeState === "running") {
            // prevent resetting grid while visualizing
            return;
          }
          resetGrid();
        }}
      />
      <Grid
        grid={gridRef.current}
        gridDim={{ $width: gridWidth, $height: gridHeight }}
        nodeDim={{ $width: w, $height: h }}
        visualize={visualize}
      />
    </VisualizeStateContext.Provider>
  );
}
