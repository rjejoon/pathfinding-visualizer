import Coord from "./coord";

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
    this.updateElementBg();
  }

  get isSource() { return this._isSource; }

  set isDest(val: boolean) {
    this._isDest = val;
    this.updateElementBg();
  }

  get isDest() { return this._isDest; }

  set isWall(val: boolean) {
    this._isWall = val;
    this.updateElementBg();
  }

  get isWall() { return this._isWall; }

  set isPath(val: boolean) {
    this._isPath = val;
    this.updateElementBg();
  }

  get isPath() { return this._isPath; }

  set isVisited(val: boolean) {
    this._isVisited = val;
    this.updateElementBg();
  }

  get isVisited() { return this._isVisited; }

  set htmlElement(val: HTMLDivElement | null) {
    this._htmlElement = val;
    this.updateElementBg();
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

  updateElementBg() {
    if (this._htmlElement === null) {
      return;
    }
    // let bgColor: string = 'none';
    this._htmlElement.classList.remove('source', 'dest', 'wall', 'path', 'visited')
    if (this._isSource) {
      this._htmlElement.classList.add('source');
      // bgColor = '#66ff66';
    } else if (this._isDest) {
      this._htmlElement.classList.add('dest');
      // bgColor = '#ff6666';
    } else if (this._isWall) {
      this._htmlElement.classList.add('wall');
      // bgColor = '#163057';
    } else if (this._isPath) {
      this._htmlElement.classList.add('path');
      // bgColor = '#ffff99';
    } else if (this._isVisited) {
      this._htmlElement.classList.add('visited');
      // bgColor = '#99e6ff';
    }

    // this._htmlElement.style.background = bgColor;
  }
}
