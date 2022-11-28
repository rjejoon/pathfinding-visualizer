import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Grid from './components/Grid';

import { Vertex } from './types';
import { initGrid, getSourceAndDest } from './grid';
import { default as algos } from './pathfinding-algorithms';

const DESIRED_DIM = 25;

interface Size {
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

  const gridRef = useRef(initGrid(numRow, numCol));
  const nodeRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const [editMode, setEditMode] = useState(EditMode.Null);
  const [algoValue, setAlgoValue] = useState<string>("bfs");
  const [, setNow] = useState(new Date());

  // reset grid on resize
  useEffect(() => {
    gridRef.current = initGrid(numRow, numCol);
    nodeRefs.current = [];
    for (let r = 0; r < numRow; r++) {
      const row: null[] = [];
      for (let c = 0; c < numCol; c++) {
        row.push(null);
      }
      nodeRefs.current.push(row);
    }
  }, [numRow, numCol]);

  // adjust width and height
  w += (gridWidth - numCol * w) / numCol - 0.01;
  h += (gridHeight - numRow * h) / numRow - 0.01;

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
      setEditMode(EditMode.Source);
    } else if (target.isDest) {
      setEditMode(EditMode.Dest);
    } else {
      setEditMode(EditMode.Wall);
    }
  }

  function resetEditMode() {
    setEditMode(EditMode.Null);
  }

  function forceUpdate() {
    setNow(new Date());
  }

  /**
   *  
   * @param target - Vertex object at the pointer
   */
  function editGrid(target: Vertex) {
    const v = gridRef.current[target.row][target.col]
    const [oldSource, oldDest] = getSourceAndDest(gridRef.current);
    if (editMode === EditMode.Wall) {
      if (!v.isSource && !v.isDest) {
        gridRef.current[target.row][target.col].isWall = true;
      }
    } else if (editMode === EditMode.Source) {
      gridRef.current[oldSource.row][oldSource.col].isSource = false;
      gridRef.current[target.row][target.col].isSource = true;

    } else if (editMode === EditMode.Dest) {
      gridRef.current[oldDest.row][oldDest.col].isDest = false;
      gridRef.current[target.row][target.col].isDest = true;
    }
    forceUpdate();
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
      console.error("Error: bfs failed");
      return;
    }
    const { visitedVerticesInOrder, parents, source, dest } = visualizer;

    const visitPromises: Promise<number>[] = [];

    for (let i = 0; i < visitedVerticesInOrder.length; i++) {
      visitPromises.push(new Promise<number>((resolve, reject) => {
        setTimeout(() => {
          const targetV = visitedVerticesInOrder[i];
          gridRef.current[targetV.row][targetV.col].isVisited = true;
          forceUpdate();
          resolve(i);
        }, 5 * i);
      }));
    }

    Promise.all(visitPromises).then(() => {
      console.log('animating path')
      animatePath(parents, source, dest)
    });
  }

  function animatePath(parents: Vertex[][], source: Vertex, v: Vertex): number {
    let i = 0;
    if (!v.isEqual(source)) {
      i = animatePath(parents, source, parents[v.row][v.col]);
    }
    setTimeout(() => {
      gridRef.current[v.row][v.col].isPath = true;
      forceUpdate();
    }, 30 * i);
    return i + 1;
  }

  function resetGridOnClick() {
    gridRef.current = initGrid(numRow, numCol);
  }

  function changeAlgoOnChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setAlgoValue(event.target.value);
  }

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
        gridStyle={{ $width: gridWidth, $height: gridHeight }}
        nodeStyle={{ $width: w, $height: h }}
        nodeRefs={nodeRefs}
        handleMouseDown={changeEditMode}
        handleMouseUp={resetEditMode}
        handleMouseMove={editGrid}
      />
    </>
  );
}




function useWindowSize(): Size {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<Size>({
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