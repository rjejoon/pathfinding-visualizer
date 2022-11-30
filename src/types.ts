

export class Coord {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  isEqual(other: Coord): boolean {
    return this.row === other.row && this.col === other.col;
  }
}


export class Vertex extends Coord {
  isSource: boolean;
  isDest: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  weight: number;
  
  constructor(
    row: number, 
    col: number, 
    weight: number = 0,
    isSource: boolean = false, 
    isDest: boolean = false, 
    isWall: boolean = false,
    isPath: boolean = false,
    isVisited: boolean = false
  ) {
    super(row, col);
    this.isSource = isSource; 
    this.isDest = isDest;
    this.isWall = isWall;
    this.isVisited = isVisited;
    this.isPath = isPath;
    this.weight = weight;
  }

  getCoord(): Coord {
    return new Coord(this.row, this.col);
  }

  copy() {
    return new Vertex(this.row, this.col, this.weight, this.isSource, this.isDest, this.isWall, this.isPath, this.isVisited);
  }

  isValid() {
    return !this.isWall;
  }

  className() {
    const classList: string[] = [];
    if (this.isSource) {
      classList.push("isSource");
    }
    if (this.isDest) {
      classList.push("isDest");
    }
    if (this.isWall) {
      classList.push("isWall");
    }
    if (this.isPath) {
      classList.push("isPath");
    }
    if (this.isVisited) {
      classList.push("isVisited");
    }
    return classList.join(" ");
  }
}

export interface Visualizer {
  visitedVerticesInOrder: Vertex[];
  parents: Vertex[][];
  source: Vertex;
  dest: Vertex;
}