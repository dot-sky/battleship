import { Gameboard } from "./Gameboard.js";
export class Player {
  constructor(type) {
    this.type = type;
    this.board = new Gameboard();
  }

  receiveAttack(coord) {
    this.board.receiveAttack(coord);
  }

  isComputer() {
    return this.type === "computer";
  }
}
