import Coord from './coord';

export default class Vertex extends Coord {
  isSource: boolean;
  isDest: boolean;
  isWall: boolean;
  weight: number;
  
  constructor(
    row: number, 
    col: number, 
    weight: number = 0,
    isSource: boolean = false, 
    isDest: boolean = false, 
    isWall: boolean = false
  ) {
    super(row, col);
    this.isSource = isSource; 
    this.isDest = isDest;
    this.isWall = isWall;
    this.weight = weight;
  }
}