import { Player } from "./Player.js";

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
    if (this.player[this.currentTurn].isComputer()) this.playRandom();

    return played;
  }

  playRandom() {
    const x = this.getRandomInt(this.player.one.board.size);
    const y = this.getRandomInt(this.player.one.board.size);

    this.playTurn([x, y]);
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

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}
