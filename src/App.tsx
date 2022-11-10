import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Grid from './components/Grid';
import Queue from 'queue-fifo';

import Coord from './models/coord';
import Vertex from './models/vertex';

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

  const [grid, setGrid] = useState<Vertex[][]>(initGrid(numRow, numCol));
  const [editMode, setEditMode] = useState(EditMode.Null);

  // reset grid on resize
  useEffect(() => {
    setGrid(initGrid(numRow, numCol));
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

  /**
   *  
   * @param target - Vertex object at the pointer
   */
  function editGrid(target: Vertex) {
    setGrid(prevGrid => {
      return prevGrid.map(row => (row.map(v => {

        // TODO 

        const newV = v.copy();

        // other vertices 
        if (!(v.row === target.row && v.col === target.col)) {
          if (editMode === EditMode.Source && v.row) {
            newV.isSource = false;
          } else if (editMode === EditMode.Dest) {
            newV.isDest = false;
          }
          return newV;
        }

        // target vertex
        if (editMode === EditMode.Wall && !newV.isSource && !newV.isDest) {
          newV.isWall = true;
        } else if (editMode === EditMode.Source && !v.isDest) {
          newV.isSource = true;
        } else if (editMode === EditMode.Dest) {
          newV.isDest = true;
        }
        return newV;


      })));
    });
  }

  function visualizeBFS() {
    const visitedVerticesInOrder = bfs(grid);

    for (let i = 0; i < visitedVerticesInOrder.length; i++) {
      setTimeout(() => {
        setGrid(prevGrid => prevGrid.map(row => row.map(u => {
          const newV = u.copy();
          if (newV.isEqual(visitedVerticesInOrder[i])) {
            newV.isVisited = true;
          }
          return newV;
        })));
      }, 5 * i);
    }
  }


  return (
    <>
      <Navbar navbarStyle={{ $height: navbarHeight }} handleClick={visualizeBFS} />
      <Grid
        grid={grid}
        gridStyle={{ $width: gridWidth, $height: gridHeight }}
        nodeStyle={{ $width: w, $height: h }}
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

/**
 * Creates numRow x numCol grid initialized with Vertex objects.
 * Source and destination vertices are initialized here.
 * 
 * @param numRow - number of rows in grid
 * @param numCol - number of cols in grid
 * @returns 
 */
function initGrid(numRow: number, numCol: number): Vertex[][] {
  const source: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.20));
  const dest: Coord = new Coord(Math.floor(numRow / 2), Math.floor(numCol * 0.80));

  const grid: Vertex[][] = [];
  for (let r = 0; r < numRow; r++) {
    const row: Vertex[] = [];
    for (let c = 0; c < numCol; c++) {
      const v = new Vertex(r, c);
      v.isSource = (r === source.row && c === source.col);
      v.isDest = (r === dest.row && c === dest.col);
      row.push(v);
    }
    grid.push(row);
  }
  return grid;
}

function getSourceAndDest(grid: Vertex[][]): [Vertex, Vertex] {
  let source: Vertex = new Vertex(-1, -1);
  let dest: Vertex = new Vertex(-1, -1);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].isSource) {
        source = grid[r][c];
      } else if (grid[r][c].isDest) {
        dest = grid[r][c];
      }
    }
  }

  if (source.row < 0 || source.col < 0 || dest.row < 0 || dest.col < 0) {
    console.error("source or dest is not valid");
  }

  return [source, dest];
}

function bfs(grid: Vertex[][]): Vertex[] {
  const visited: boolean[][] = [];
  for (let i = 0; i < grid.length; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < grid[i].length; j++) {
      row.push(false);
    }
    visited.push(row);
  }

  const [source, dest] = getSourceAndDest(grid);
  const queue = new Queue<Vertex>();
  const visitedVerticesInOrder: Vertex[] = [];

  queue.enqueue(source);
  visited[source.row][source.col] = true;

  while (!queue.isEmpty()) {
    const v = queue.dequeue();

    if (!v) {
      console.error('Vertex is null');
      break;
    }

    const neighs = [
      new Coord(v.row - 1, v.col),  // up
      new Coord(v.row, v.col + 1),  // right
      new Coord(v.row + 1, v.col),  // bottom
      new Coord(v.row, v.col - 1),  // left
    ].filter(({ row, col }) => (0 <= row && row < grid.length) && (0 <= col && col < grid[0].length))
      .map(({ row, col }) => grid[row][col])
      .filter(v => v.isValid());

    for (const u of neighs) {
      if (visited[u.row][u.col] === false) {
        queue.enqueue(u);
        visited[u.row][u.col] = true;
        visitedVerticesInOrder.push(u);
      }
      if (u.isEqual(dest)) {
        return visitedVerticesInOrder;
      }
    }
  }
  return visitedVerticesInOrder;
}
