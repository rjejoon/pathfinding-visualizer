import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";
import Navbar from "./components/Navbar";
import Grid from "./components/Grid";

import {
  GraphAlgoOptions,
  Vertex,
  VisualizeState,
  VisualizeStateReducerAction,
} from "./types";
import { initGrid } from "./grid";
import algoVisualizers from "./graph/visualizer-map";
import useWindowSize from "./hooks/use-window-size";
import {
  VisualizeStateContext,
  VisualizeStateDispatchContext,
} from "./context/VisualizeStateContext";

const DESIRED_DIM = 25;

const reducer = (
  state: VisualizeState,
  action: VisualizeStateReducerAction
) => {
  switch (action.type) {
    case "running":
      return "running";
    case "finished":
      return "finished";
    case "idle":
      return "idle";
  }
  throw Error("Unknown action: " + action.type);
};

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
  const [algoValue, setAlgoValue] = useState<GraphAlgoOptions>("bfs");
  const [, setNow] = useState(new Date()); // used to force deep re-rendering
  const [visualizeState, dispatchVisualizeState] = useReducer(reducer, "idle");

  const resetGrid = useCallback(() => {
    gridRef.current = initGrid(numRow, numCol);
    dispatchVisualizeState({ type: "idle" });
    forceDeepRender();
  }, [numRow, numCol]);

  useEffect(() => {
    // reset grid on resize
    resetGrid();
  }, [numRow, numCol, resetGrid]);

  /**
   * Force deep re-rendering.
   */
  function forceDeepRender() {
    setNow(new Date());
  }

  /**
   * Visualize the selected algorithm.
   */
  async function visualize() {
    if (!(algoValue in algoVisualizers)) {
      console.error(`Error: Invalid algoValue: ${algoValue}`);
      return;
    }

    if (visualizeState === "running") {
      // prevent multiple visualizations
      return;
    }
    dispatchVisualizeState({ type: "running" });

    // reset visited and path nodes
    for (let r = 0; r < gridRef.current.length; r++) {
      for (let c = 0; c < gridRef.current[0].length; c++) {
        gridRef.current[r][c].isVisited = false;
        gridRef.current[r][c].isPath = false;
      }
    }

    const visualizer = algoVisualizers[algoValue](gridRef.current);

    if (visualizer === null) {
      console.error(`Error: ${algoValue} failed`);
      dispatchVisualizeState({ type: "finished" });
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
            }, 5 * i);
          })
        );
      }
    }

    if (visualizeState !== "finished") {
      await Promise.all(visitPromises);
    }
    await Promise.all(animatePath(parents, source, dest));
    dispatchVisualizeState({ type: "finished" });
  }

  function animatePath(parents: Vertex[][], source: Vertex, dest: Vertex) {
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
          }, 10 * i);
        })
      );
      return i + 1;
    }

    animatePathHelper(dest);
    return parentPromises;
  }

  function changeAlgoOptionOnChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setAlgoValue(event.target.value as GraphAlgoOptions);
    resetGrid();
  }

  return (
    <VisualizeStateContext.Provider value={visualizeState}>
      <VisualizeStateDispatchContext.Provider value={dispatchVisualizeState}>
        <Navbar
          navbarStyle={{ $height: navbarHeight }}
          algoValue={algoValue}
          changeAlgoOnChange={changeAlgoOptionOnChange}
          visualizeOnClick={visualize}
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
      </VisualizeStateDispatchContext.Provider>
    </VisualizeStateContext.Provider>
  );
}
