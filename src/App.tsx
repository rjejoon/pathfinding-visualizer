import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Grid from './components/Grid';

import { Vertex } from './types';
import { initGrid, getSourceAndDest } from './grid';
import { default as algos } from './pathfinding-algorithms';

const DESIRED_DIM = 25;

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

enum EditMode {
  Null,
  Source,
  Dest,
  Wall,
  Weight,
}


export default function App() {
  const windowSize = useWindowSize();
  const navbarHeight = 70;

  const gridWidth = windowSize.width || 0;
  const gridHeight = (windowSize.height || 0) - navbarHeight;

  let w = DESIRED_DIM, h = DESIRED_DIM;
  const numRow = Math.floor(gridHeight / DESIRED_DIM);
  const numCol = Math.floor(gridWidth / DESIRED_DIM);

  // adjust width and height
  w += (gridWidth - numCol * w) / numCol - 0.01;
  h += (gridHeight - numRow * h) / numRow - 0.01;

  const gridRef = useRef(initGrid(numRow, numCol));
  const editMode = useRef(EditMode.Null);
  const lastEditedVertex = useRef<Vertex | null>(null);
  const [algoValue, setAlgoValue] = useState<string>("bfs");
  const [, setNow] = useState(new Date());
  const [hasVisualized, setHasVisualized] = useState(false);

  // reset grid on resize
  useEffect(() => {
    gridRef.current = initGrid(numRow, numCol);
    setHasVisualized(false);
    forceDeepRender();
  }, [numRow, numCol]);


  /**
   * Change edit mode depending on which type of vertex the mouse is pointing.
   * If mouse is down on source vertex, set EditMode to Source.
   * If mouse is down on destination vertex, set EditMode to Dest.
   * Otherwise, set EditMode to Wall.
   * 
   * @param target - Vertex object at the pointer
   */
  function changeEditMode(target: Vertex) {
    if (target.isSource) {
      editMode.current = EditMode.Source;
    } else if (target.isDest) {
      editMode.current = EditMode.Dest;
    } else {
      editMode.current = EditMode.Wall;
    }
  }

  function resetEditMode() {
    editMode.current = EditMode.Null;
  }

  /**
   * Force deep re-rendering.
   */
  function forceDeepRender() {
    setNow(new Date());
  }


  /**
   *  
   * @param target - Vertex object at the pointer
   */
  function editGrid(target: Vertex) {
    if (editMode.current === EditMode.Null) {
      return;
    }

    const v = gridRef.current[target.row][target.col]
    if (lastEditedVertex.current !== null && v.isEqual(lastEditedVertex.current)) {
      // prevent triggering editing within the same vertex
      return;
    }

    const [oldSource, oldDest] = getSourceAndDest(gridRef.current);
    if (editMode.current === EditMode.Wall) {
      if (!v.isSource && !v.isDest) {
        v.isWall = !v.isWall;
      }
    } else if (editMode.current === EditMode.Source) {
      if (!v.isWall) {
        gridRef.current[oldSource.row][oldSource.col].isSource = false;
        v.isSource = true;
      }
    } else if (editMode.current === EditMode.Dest) {
      if (!v.isWall) {
        gridRef.current[oldDest.row][oldDest.col].isDest = false;
        v.isDest = true;
      }
    }
    lastEditedVertex.current = v;

    if (hasVisualized) {
      visualize();
    }
  }

  function visualize() {
    if (!(algoValue in algos)) {
      console.error(`Error: ${algoValue} does not exist`);
      return;
    }

    // reset visited and path nodes
    for (let r = 0; r < gridRef.current.length; r++) {
      for (let c = 0; c < gridRef.current[0].length; c++) {
        gridRef.current[r][c].isVisited = false;
        gridRef.current[r][c].isPath = false;
      }
    }

    const visualizer = algos[algoValue](gridRef.current);

    if (visualizer === null) {
      console.error(`Error: ${algoValue} failed`);
      return;
    }
    const { visitedVerticesInOrder, parents, source, dest } = visualizer;

    const visitPromises: Promise<number>[] = [];

    for (let i = 0; i < visitedVerticesInOrder.length; i++) {
      const targetV = visitedVerticesInOrder[i];
      if (hasVisualized) {
        gridRef.current[targetV.row][targetV.col].isVisited = true;
      } else {
        visitPromises.push(new Promise<number>((resolve, reject) => {
          setTimeout(() => {
            gridRef.current[targetV.row][targetV.col].isVisited = true;
            resolve(i);
          }, 5 * i);
        }));
      }
    }

    if (hasVisualized) {
      animatePath(parents, source, dest);
      setHasVisualized(true);
    } else {
      Promise.all(visitPromises).then(() => {
        animatePath(parents, source, dest)
        setHasVisualized(true);
      });
    }
  }

  function animatePath(parents: Vertex[][], source: Vertex, v: Vertex): number {
    if (v === undefined) {
      return -1;
    }
    let i = 0;
    if (!v.isEqual(source)) {
      i = animatePath(parents, source, parents[v.row][v.col]);
    }

    if (hasVisualized) {
      gridRef.current[v.row][v.col].isPath = true;
    } else {
      setTimeout(() => {
        gridRef.current[v.row][v.col].isPath = true;
      }, 10 * i);
    }
    return i + 1;
  }

  function resetGridOnClick() {
    gridRef.current = initGrid(numRow, numCol);
    setHasVisualized(false);
    forceDeepRender();
  }

  function changeAlgoOnChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setAlgoValue(event.target.value);
  }
  console.log("render App");    // TODO delete later

  return (
    <>
      <Navbar
        navbarStyle={{ $height: navbarHeight }}
        algoValue={algoValue}
        changeAlgoOnChange={changeAlgoOnChange}
        visualizeOnClick={visualize}
        resetGridOnClick={resetGridOnClick}
      />
      <Grid
        grid={gridRef.current}
        gridDim={{ $width: gridWidth, $height: gridHeight }}
        nodeDim={{ $width: w, $height: h }}
        handleMouseDown={changeEditMode}
        handleMouseUp={resetEditMode}
        handleMouseMove={editGrid}
      // handleMouseClick={editGrid}
      />
    </>
  );
}


function useWindowSize(): WindowSize {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}