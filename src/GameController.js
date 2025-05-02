import { Player } from "./player";

export class GameController {
  constructor() {
    this.initPlayers();

    this.state = "active";
  }

  initPlayers() {
    this.player = {
      one: new Player("real"),
      two: new Player("computer"),
    };

    this.player.one.board.defaultOne();
    this.player.two.board.defaultTwo();

    this.currentTurn = "one";
  }

  playTurn(coord) {
    if (this.gameEnded()) return false;

    const played = this.player[this.getOpponent()].board.receiveAttack(coord);

    if (played) {
      if (this.player[this.getOpponent()].board.allShipsSunk()) this.endGame();
      else this.switchPlayer();
    }

    return played;
  }

  endGame() {
    this.state = "end";
    this.winner = this.currentTurn;
  }

  switchPlayer() {
    this.currentTurn = this.currentTurn === "one" ? "two" : "one";
  }

  getOpponent() {
    return this.currentTurn === "one" ? "two" : "one";
  }

  gameEnded() {
    return this.state === "end";
  }
}
