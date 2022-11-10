
export default class Coord {
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