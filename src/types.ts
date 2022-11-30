

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
  private _isSource: boolean;
  private _isDest: boolean;
  private _isWall: boolean;
  private _isVisited: boolean;
  private _isPath: boolean;
  private _weight: number;
  private _htmlElement: HTMLDivElement | null;
  
  constructor(
    row: number, 
    col: number, 
    weight: number = 0,
    isSource: boolean = false, 
    isDest: boolean = false, 
    isWall: boolean = false,
    isPath: boolean = false,
    isVisited: boolean = false,
    htmlElement: HTMLDivElement | null = null
  ) {
    super(row, col);
    this._isSource = isSource; 
    this._isDest = isDest;
    this._isWall = isWall;
    this._isVisited = isVisited;
    this._isPath = isPath;
    this._weight = weight;
    this._htmlElement = htmlElement;
  }

  set isSource(val: boolean) {
    this._isSource = val;
    this.updateElementBackground();
  }

  get isSource() { return this._isSource; }

  set isDest(val: boolean) {
    this._isDest = val;
    this.updateElementBackground();
  }

  get isDest() { return this._isDest; }

  set isWall(val: boolean) {
    this._isWall = val;
    this.updateElementBackground();
  }

  get isWall() { return this._isWall; }

  set isPath(val: boolean) {
    this._isPath = val;
    this.updateElementBackground();
  }

  get isPath() { return this._isPath; }

  set isVisited(val: boolean) {
    this._isVisited = val;
    this.updateElementBackground();
  }

  get isVisited() { return this._isVisited; }

  set htmlElement(val: HTMLDivElement | null) {
    this._htmlElement = val;
    this.updateElementBackground();
  }

  get htmlElement() { return this._htmlElement; }

  getCoord(): Coord {
    return new Coord(this.row, this.col);
  }

  copy() {
    return new Vertex(this.row, this.col, this._weight, this._isSource, this._isDest, this._isWall, this._isPath, this._isVisited, this._htmlElement);
  }

  isValid() {
    return !this._isWall;
  }

  updateElementBackground() {
    if (this._htmlElement === null) {
      return;
    }
    let bgColor: string = 'none';
    if (this._isSource) {
      bgColor = '#66ff66';
    } else if (this._isDest) {
      bgColor = '#ff6666';
    } else if (this._isWall) {
      bgColor = '#163057';
    } else if (this._isPath) {
      bgColor = '#ffff99';
    } else if (this._isVisited) {
      bgColor = '#99e6ff';
    }

    this._htmlElement.style.background = bgColor;
  }
}

export interface Visualizer {
  visitedVerticesInOrder: Vertex[];
  parents: Vertex[][];
  source: Vertex;
  dest: Vertex;
}