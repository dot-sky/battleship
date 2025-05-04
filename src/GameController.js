import { Player } from "./Player.js";
import { ComputerDriver } from "./ComputerDriver.js";

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
    this.compDriver = {};

    // Add driver to computer players
    if (this.player.one.isComputer())
      this.compDriver.one = new ComputerDriver(this.player.two.board);
    if (this.player.two.isComputer())
      this.compDriver.two = new ComputerDriver(this.player.one.board);

    this.randomizeBoards();

    this.currentTurn = "one";
  }

  randomizeBoards() {
    this.player.one.board.randomBoardPlacement();
    this.player.two.board.randomBoardPlacement();
  }

  playTurn(coord) {
    if (this.gameEnded()) return false;

    const played = this.player[this.getOpponent()].board.receiveAttack(coord);

    if (played) {
      if (this.player[this.getOpponent()].board.allShipsSunk()) this.endGame();
      else this.switchPlayer();
    }

    // verify if next turn is a computer player
    if (this.player[this.currentTurn].isComputer())
      this.playTurn(this.compDriver[this.currentTurn].playCoords());

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

  isCurrentPlayer(player) {
    return player === this.currentTurn;
  }

  gameEnded() {
    return this.state === "end";
  }
}
