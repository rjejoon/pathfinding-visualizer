import Coord from "./coord";

export class Vertex extends Coord {
  private _isSource: boolean;
  private _isDest: boolean;
  private _isWall: boolean;
  private _isVisited: boolean;
  private _isPath: boolean;
  private _weight: number;
  private _htmlElement: HTMLDivElement | null;
  private _isAnimationEnabled: boolean;
  
  constructor(
    row: number, 
    col: number, 
    weight: number = 0,
    isSource: boolean = false, 
    isDest: boolean = false, 
    isWall: boolean = false,
    isPath: boolean = false,
    isVisited: boolean = false,
    htmlElement: HTMLDivElement | null = null,
    isAnimationEnabled: boolean = true,
  ) {
    super(row, col);
    this._isSource = isSource; 
    this._isDest = isDest;
    this._isWall = isWall;
    this._isVisited = isVisited;
    this._isPath = isPath;
    this._weight = weight;
    this._htmlElement = htmlElement;
    this._isAnimationEnabled = isAnimationEnabled;
  }

  set isSource(val: boolean) {
    this._isSource = val;
    this.updateElementClassList();
  }

  get isSource() { return this._isSource; }

  set isDest(val: boolean) {
    this._isDest = val;
    this.updateElementClassList();
  }

  get isDest() { return this._isDest; }

  set isWall(val: boolean) {
    this._isWall = val;
    this.updateElementClassList();
  }

  get isWall() { return this._isWall; }

  set isPath(val: boolean) {
    this._isPath = val;
    this.updateElementClassList();
  }

  get isPath() { return this._isPath; }

  set isVisited(val: boolean) {
    this._isVisited = val;
    this.updateElementClassList();
  }

  get isVisited() { return this._isVisited; }

  set htmlElement(val: HTMLDivElement | null) {
    this._htmlElement = val;
    this.updateElementClassList();
  }

  get htmlElement() { return this._htmlElement; }

  get isAnimationEnabled() { return this._isAnimationEnabled; }

  set isAnimationEnabled(val: boolean) { 
    this._isAnimationEnabled = val; 
    if (this._htmlElement === null) {
      return;
    }

    if (val) {
      this._htmlElement.classList.add('animate');
    } else {
      this._htmlElement.classList.remove('animate');
    }
  }

  getCoord(): Coord {
    return new Coord(this.row, this.col);
  }

  copy() {
    return new Vertex(this.row, this.col, this._weight, this._isSource, this._isDest, this._isWall, this._isPath, this._isVisited, this._htmlElement);
  }

  /**
   * Valid means the vertex can be visited.
   * @returns true if the vertex is valid, false otherwise.
   */
  isValid() {
    return !this._isWall;
  }

  /**
   * Updates the class list of the html element to reflect the current state of the vertex.
   */
  updateElementClassList() {
    if (this._htmlElement === null) {
      return;
    }
    this._htmlElement.classList.remove('source', 'dest', 'wall', 'path', 'visited')
    if (this._isSource) {
      this._htmlElement.classList.add('source');
    } else if (this._isDest) {
      this._htmlElement.classList.add('dest');
    } else if (this._isWall) {
      this._htmlElement.classList.add('wall');
    } else if (this._isPath) {
      this._htmlElement.classList.add('path');
    } else if (this._isVisited) {
      this._htmlElement.classList.add('visited');
    } 
  }
}
