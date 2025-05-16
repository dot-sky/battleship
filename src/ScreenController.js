import { Gameboard } from "./Gameboard.js";
import { GameController } from "./GameController.js";
import { EventHandler } from "./EventHandler.js";

export class ScreenController {
  constructor(doc) {
    this.doc = doc;
    this.gameController = new GameController();
    this.eventHandler = new EventHandler(this);

    this.switchScreen = null;
    this.playBlocked = false;

    this.cacheDOM();
    this.eventHandler.addEvents();
    this.render();
  }

  cacheDOM() {
    this.boardOne = this.doc.querySelector("#board-1");
    this.boardTwo = this.doc.querySelector("#board-2");

    // Mode
    this.controlsCont = this.doc.querySelector(".controls-start");
    this.controlsDesc = this.doc.querySelector(".controls-desc");
    this.controlsBtnGroup = this.doc.querySelector(".controls-btn-group");

    // Switching
    this.switchContainer = this.doc.querySelector("#switch-window");
    this.closeSwitchBtn = this.doc.querySelector("#close-switch");

    // Status
    this.gameMode = this.doc.querySelector("#game-mode");
    this.gameStatus = this.doc.querySelector("#game-status");
    this.currentPlayer = this.doc.querySelector("#current-player");

    // Game ended
    // this.endGameContainer = this.doc.querySelector("#end-game-container");
    // this.endGameMsg = this.doc.querySelector("#end-game-msg");
    // this.restartRoundBtn = this.doc.querySelector("#restart-round");
    // this.restartGameBtn = this.doc.querySelector("#restart-game");
  }

  render() {
    if (this.gameController.gameEnded()) {
      this.renderEndGame();
    }

    if (!this.gameController.mode) {
      this.renderSelectMode();
    } else if (this.gameController.mode && this.gameController.gamePrepping()) {
      this.renderPlacementControls();
    } else {
      this.hidePlacementControls();
    }

    if (!this.switchScreen) {
      this.renderBoard(
        this.boardOne,
        this.gameController.player.one.board,
        this.gameController.isCurrentPlayer("one")
      );
      this.renderBoard(
        this.boardTwo,
        this.gameController.player.two.board,
        this.gameController.isCurrentPlayer("two")
      );
      this.showBoards();
    } else {
      this.hideBoards();
    }

    // this.updateGameInfo();
  }

  updateGameInfo() {
    this.gameMode.textContent = this.gameController.mode;
    this.gameStatus.textContent = this.gameController.state;
    this.currentPlayer.textContent = this.gameController.currentTurn;
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

    if (ownBoard) {
      boardDOM.classList.add("own-board");
    } else {
      boardDOM.classList.remove("own-board");
    }
  }

  renderCell(gameBoard, ownBoard, x, y) {
    const cell = this.doc.createElement("button");

    const status = gameBoard.board[x][y].status;
    if (status === Gameboard.SHIP_CELL && ownBoard) {
      cell.classList.add("ship-cell");

      if (this.gameController.gamePrepping()) {
        this.eventHandler.attachShipDraggingEvent(cell);
        this.eventHandler.attachRotateShipEvent(cell);
      }
    } else if (status === Gameboard.SHIP_CELL_HIT) {
      cell.classList.add("attacked-ship");
    } else if (status === Gameboard.EMPTY_CELL_HIT) {
      const circle = this.doc.createElement("span");
      circle.classList.add("empty-circle");
      cell.appendChild(circle);

      cell.classList.add("attacked-cell");
    } else {
      if (!ownBoard) {
        const circle = this.doc.createElement("span");
        circle.classList.add("empty-circle-hover");
        cell.appendChild(circle);

        this.eventHandler.attachHoverInOpponentBoard(cell);
        this.eventHandler.attachHoverOutOpponentBoard(cell);
      }

      cell.classList.add("empty-cell");
    }

    // events
    if (ownBoard && this.gameController.gamePrepping()) {
      this.eventHandler.attachShipDragDownEvent(cell);
    }

    if (!ownBoard && this.gameController.gameOnGoing() && !this.gameBlocked) {
      this.eventHandler.attachCellClickEvent(cell);
    }

    cell.setAttribute("x-coord", x);
    cell.setAttribute("y-coord", y);

    cell.classList.add("board-cell");

    return cell;
  }

  renderSelectMode() {
    const friendBtn = this.doc.createElement("btn");
    const computerBtn = this.doc.createElement("btn");

    this.controlsBtnGroup.textContent = "";
    this.controlsDesc.textContent = "Choose your Opponent";
    friendBtn.textContent = "Friend";
    computerBtn.textContent = "Computer";

    friendBtn.classList.add("btn");
    friendBtn.classList.add("btn-secondary");
    computerBtn.classList.add("btn");
    computerBtn.classList.add("btn-primary");

    this.eventHandler.attachModeEvent(friendBtn, "friend");
    this.eventHandler.attachModeEvent(computerBtn, "computer");

    this.controlsBtnGroup.appendChild(friendBtn);
    this.controlsBtnGroup.appendChild(computerBtn);
  }

  renderPlacementControls() {
    this.controlsDesc.textContent = "Place your fleet! ";

    const randomBtn = this.doc.createElement("btn");
    const confirmBtn = this.doc.createElement("btn");

    this.controlsBtnGroup.textContent = "";
    randomBtn.textContent = "Random";

    randomBtn.classList.add("btn");
    randomBtn.classList.add("btn-secondary");
    confirmBtn.classList.add("btn");
    confirmBtn.classList.add("btn-primary");

    this.eventHandler.attachRandomBtnEvent(randomBtn);
    if (
      this.gameController.friendMode() &&
      !this.gameController.secondPlayerTurn()
    ) {
      confirmBtn.textContent = "Confirm";
      this.eventHandler.attachConfirmBtnEvent(confirmBtn);
    } else {
      confirmBtn.textContent = "Start";
      this.eventHandler.attachStartBtnEvent(confirmBtn);
    }

    this.controlsBtnGroup.appendChild(randomBtn);
    this.controlsBtnGroup.appendChild(confirmBtn);
  }

  hidePlacementControls() {
    this.controlsBtnGroup.textContent = "";
  }

  playTurn(coords) {
    const attack = this.gameController.playTurn(coords);
    const board =
      this.gameController.player[this.gameController.currentTurn].board;

    this.getCell(this.gameController.currentTurn, coords).replaceWith(
      this.renderCell(board, false, coords[0], coords[1])
    );

    if (attack.success && this.gameController.friendMode()) {
      this.blockPlays();
    } else {
      this.render();
    }
  }

  blockPlays() {
    this.playBlocked = true;
  }

  confirmPlacement() {
    this.renderSwitchingWindow();
    this.gameController.switchPlayer();
    this.render();
  }

  renderSwitchingWindow() {
    this.switchContainer.classList.remove("d-none");
    this.switchScreen = true;
    this.render();
  }

  hideSwitchingWindow() {
    this.switchContainer.classList.add("d-none");
    this.switchScreen = false;
  }

  hideBoards() {
    this.boardOne.classList.add("d-none");
    this.boardTwo.classList.add("d-none");
  }

  showBoards() {
    this.boardOne.classList.remove("d-none");
    this.boardTwo.classList.remove("d-none");
  }

  startGame() {
    this.gameController.startGame();
    if (this.gameController.friendMode()) {
      this.renderSwitchingWindow();
    }
  }

  getCell(player, coords) {
    let board;
    if (player === "one") {
      board = this.boardOne;
    } else {
      board = this.boardTwo;
    }
    return board.children[coords[0]].children[coords[1]];
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
