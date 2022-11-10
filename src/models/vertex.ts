import Coord from './coord';

export default class Vertex extends Coord {
  isSource: boolean;
  isDest: boolean;
  isWall: boolean;
  isVisited: boolean;
  weight: number;
  
  constructor(
    row: number, 
    col: number, 
    weight: number = 0,
    isSource: boolean = false, 
    isDest: boolean = false, 
    isWall: boolean = false,
    isVisited: boolean = false
  ) {
    super(row, col);
    this.isSource = isSource; 
    this.isDest = isDest;
    this.isWall = isWall;
    this.isVisited = isVisited;
    this.weight = weight;
  }

  getCoord(): Coord {
    return new Coord(this.row, this.col);
  }

  copy() {
    return new Vertex(this.row, this.col, this.weight, this.isSource, this.isDest, this.isWall, this.isVisited);
  }
}