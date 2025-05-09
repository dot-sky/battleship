import { Player } from "./Player.js";
import { ComputerDriver } from "./ComputerDriver.js";

export class GameController {
  static #STATE = {
    PREP: "preparation",
    ON_GOING: "in progress",
    END: "end",
  };

  constructor() {
    this.initPlayers();

    this.state = GameController.#STATE.PREP;
  }

  initPlayers() {
    this.player = {
      one: new Player("real"),
      two: new Player("computer"),
    };
    this.compDriver = {};

    // Add driver to computer players
    if (this.player.one.isComputer())
      this.compDriver.one = new ComputerDriver(this.player.two.board, this);
    if (this.player.two.isComputer())
      this.compDriver.two = new ComputerDriver(this.player.one.board, this);

    this.randomizeBoards();

    this.currentTurn = "one";
  }

  randomizeBoards() {
    this.player.one.board.randomBoardPlacement();
    this.player.two.board.randomBoardPlacement();
  }

  playTurn(coord) {
    if (!this.gameOnGoing()) return false;

    const attack = this.player[this.getOpponent()].board.receiveAttack(coord);

    if (attack.success) {
      if (this.player[this.getOpponent()].board.allShipsSunk()) this.endGame();
      else this.switchPlayer();
    }

    // verify if next turn is a computer player
    if (this.player[this.currentTurn].isComputer()) {
      this.compDriver[this.currentTurn].play();
    }

    return attack;
  }

  // Placing phase
  moveShip(from, to) {
    this.player[this.currentTurn].board.move(from, to);
  }

  rotateShip(coords) {
    this.player[this.currentTurn].board.rotateShip(coords);
  }

  // status methods
  startGame() {
    this.state = GameController.#STATE.ON_GOING;
  }

  endGame() {
    this.state = GameController.#STATE.END;
    this.winner = this.currentTurn;
  }

  gameEnded() {
    return this.state === GameController.#STATE.END;
  }

  gameOnGoing() {
    return this.state === GameController.#STATE.ON_GOING;
  }

  // Player methods
  switchPlayer() {
    this.currentTurn = this.currentTurn === "one" ? "two" : "one";
  }

  getOpponent() {
    return this.currentTurn === "one" ? "two" : "one";
  }

  isCurrentPlayer(player) {
    return player === this.currentTurn;
  }
}
