import Coord from './coord';

export default class Vertex extends Coord {
  isSource: boolean;
  isDest: boolean;
  weight: number;
  
  constructor(
    row: number, 
    col: number, 
    isSource: boolean = false, 
    isDest: boolean = false, 
    weight: number = 0
  ) {
    super(row, col);
    this.isSource = isSource; 
    this.isDest = isDest;
    this.weight = weight;
  }
}