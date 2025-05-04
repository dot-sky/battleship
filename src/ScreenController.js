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

    this.endGameContainer = this.doc.querySelector("#end-game-container");
    this.randomizerBtn = this.doc.querySelector("#random-board");
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
  }

  renderBoard(boardDOM, gameBoard, activeBoard) {
    boardDOM.textContent = "";

    for (let i = 0; i < gameBoard.size; i++) {
      const row = this.doc.createElement("div");

      for (let j = 0; j < gameBoard.size; j++) {
        const cell = this.renderCell(gameBoard, activeBoard, i, j);
        row.appendChild(cell);
      }

      boardDOM.appendChild(row);
    }
  }

  renderCell(gameBoard, activeBoard, x, y) {
    const cell = this.doc.createElement("button");

    const status = gameBoard.board[x][y].status;
    if (status === Gameboard.EMPTY_CELL) {
      cell.textContent = ".";
      cell.classList.add("empty-cell");
    } else if (status === Gameboard.SHIP_CELL) {
      cell.textContent = "O";
      cell.classList.add("ship-cell");
    } else if (status === Gameboard.SHIP_CELL_HIT) {
      cell.textContent = "X";
      cell.classList.add("attacked-ship");
    } else {
      cell.textContent = ".";
      cell.classList.add("attacked-cell");
    }

    if (activeBoard && !this.gameController.gameEnded()) {
      this.eventHandler.attachCellClickEvent(cell);
    }

    cell.setAttribute("x-coord", x);
    cell.setAttribute("y-coord", y);

    cell.classList.add("board-cell");

    return cell;
  }

  // End Game
  renderEndGame() {
    this.endGameContainer.textContent = "";
    const msg = this.doc.createElement("div");
    msg.textContent = `Player ${this.gameController.winner} has won!`;
    this.endGameContainer.appendChild(msg);
  }
}
