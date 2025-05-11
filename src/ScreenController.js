import { Gameboard } from "./Gameboard.js";
import { GameController } from "./GameController.js";
import { EventHandler } from "./EventHandler.js";

export class ScreenController {
  constructor(doc) {
    this.doc = doc;
    this.gameController = new GameController();
    this.eventHandler = new EventHandler(this);
    this.cacheDOM();
    this.eventHandler.addEvents();
    this.render();
  }

  cacheDOM() {
    this.boardOne = this.doc.querySelector("#board-1");
    this.boardTwo = this.doc.querySelector("#board-2");

    this.modeBtn = this.doc.querySelector("#select-mode");
    this.computerInput = this.doc.querySelector("#radio-computer");
    this.friendInput = this.doc.querySelector("#radio-friend");

    this.randomizerBtn = this.doc.querySelector("#random-board");
    this.startBtn = this.doc.querySelector("#start-game");

    // Status
    this.gameMode = this.doc.querySelector("#game-mode");
    this.gameStatus = this.doc.querySelector("#game-status");

    // Game ended
    this.endGameContainer = this.doc.querySelector("#end-game-container");
    this.endGameMsg = this.doc.querySelector("#end-game-msg");
    this.restartRoundBtn = this.doc.querySelector("#restart-round");
    this.restartGameBtn = this.doc.querySelector("#restart-game");
  }

  render() {
    this.renderBoard(
      this.boardOne,
      this.gameController.player.one.board,
      !this.gameController.isCurrentPlayer("one")
    );
    this.renderBoard(
      this.boardTwo,
      this.gameController.player.two.board,
      !this.gameController.isCurrentPlayer("two")
    );

    if (this.gameController.gameEnded()) {
      this.renderEndGame();
    }

    this.updateGameInfo();
  }

  updateGameInfo() {
    this.gameMode.textContent = this.gameController.mode;
    this.gameStatus.textContent = this.gameController.state;
  }

  renderBoard(boardDOM, gameBoard, ownBoard) {
    boardDOM.textContent = "";

    for (let i = 0; i < gameBoard.size; i++) {
      const row = this.doc.createElement("div");

      for (let j = 0; j < gameBoard.size; j++) {
        const cell = this.renderCell(gameBoard, ownBoard, i, j);
        row.appendChild(cell);
      }

      boardDOM.appendChild(row);
    }
  }

  renderCell(gameBoard, ownBoard, x, y) {
    const cell = this.doc.createElement("button");

    const status = gameBoard.board[x][y].status;
    if (status === Gameboard.EMPTY_CELL) {
      cell.textContent = ".";
      cell.classList.add("empty-cell");
    } else if (status === Gameboard.SHIP_CELL) {
      cell.textContent = "O";
      cell.classList.add("ship-cell");
      this.eventHandler.attachShipDraggingEvent(cell);
    } else if (status === Gameboard.SHIP_CELL_HIT) {
      cell.textContent = "X";
      cell.classList.add("attacked-ship");
    } else {
      cell.textContent = ".";
      cell.classList.add("attacked-cell");
    }

    if (!ownBoard && this.gameController.gamePrepping()) {
      this.eventHandler.attachShipDragDownEvent(cell);
      this.eventHandler.attachRotateShipEvent(cell);
    }

    if (ownBoard && this.gameController.gameOnGoing()) {
      this.eventHandler.attachCellClickEvent(cell);
    }

    cell.setAttribute("x-coord", x);
    cell.setAttribute("y-coord", y);

    cell.classList.add("board-cell");

    return cell;
  }
  // Moving ships
  moveShip(start, end) {
    this.gameController.moveShip(start, end);
    this.render();
  }

  rotateShip(coords) {
    this.gameController.rotateShip(coords);
    this.render();
  }

  // End Game
  renderEndGame() {
    this.endGameMsg.textContent = `Player ${this.gameController.winner} has won!`;
    this.endGameContainer.classList.remove("hidden");
  }
}
