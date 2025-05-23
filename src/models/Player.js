import { Gameboard } from "./Gameboard.js";
export class Player {
  constructor(type, name = "Player") {
    this.type = type;
    this.name = name;
    this.board = new Gameboard();
  }

  receiveAttack(coord) {
    this.board.receiveAttack(coord);
  }

  isComputer() {
    return this.type === "computer";
  }
}
