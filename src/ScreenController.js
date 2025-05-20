import { Gameboard } from "./Gameboard.js";
import { GameController } from "./GameController.js";
import { EventHandler } from "./EventHandler.js";

export class ScreenController {
  constructor(doc) {
    this.doc = doc;
    this.gameController = new GameController();
    this.eventHandler = new EventHandler(this);

    this.switchScreen = null;
    this.playEnabled = true;

    this.cacheDOM();
    this.eventHandler.addEvents();
    this.render();
  }

  cacheDOM() {
    this.gameBoardContainer = this.doc.querySelector("#gameboard-container");
    this.boardOne = this.doc.querySelector("#board-1");
    this.boardTwo = this.doc.querySelector("#board-2");

    // Controls
    this.controlsContainer = this.doc.querySelector(".controls-start");

    // Switching
    this.switchContainer = this.doc.querySelector("#switch-window");
    this.closeSwitchBtn = this.doc.querySelector("#close-switch");

    // Game Status
    this.gameMode = this.doc.querySelector("#game-mode");
    this.gameStatus = this.doc.querySelector("#game-status");
    this.currentPlayer = this.doc.querySelector("#current-player");

    // Players
    this.status1 = this.doc.querySelector("#player-1-status");
    this.status2 = this.doc.querySelector("#player-2-status");

    // Player Info
    this.player1Name = this.doc.querySelector("#player-1-name");
    this.player2Name = this.doc.querySelector("#player-2-name");
    this.player1Score = this.doc.querySelector("#player-1-score");
    this.player2Score = this.doc.querySelector("#player-2-score");
  }

  // Render Methods
  render() {
    this.renderControls();
    this.renderPlayerInputs();
    this.renderPlayersAndBoards();
  }

  renderControls() {
    if (!this.gameController.mode) {
      this.renderSelectMode();
    } else if (
      this.gameController.mode &&
      this.gameController.gamePrepping() &&
      !this.switchScreen
    ) {
      this.renderPlacementControls();
    } else if (this.gameController.gameEnded()) {
      this.renderEndRoundControls();
    } else if (this.gameController.gameOnGoing() && !this.switchScreen) {
      this.renderAttackMsg();
    } else {
      this.clearControlContainer();
    }
  }

  renderPlayerInputs() {
    if (
      this.gameController.mode &&
      this.gameController.gamePrepping() &&
      !this.switchScreen
    )
      this.enablePlayerNameEdit();
    else {
      this.disablePlayerNameEdit();
      this.renderPlayerName();
    }
  }

  renderPlayersAndBoards() {
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
      this.renderPlayerStatus();
      this.renderPlayerInfo();
    } else {
      this.hideBoards();
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

    if (activeBoard) {
      boardDOM.classList.add("active-board");
    } else {
      boardDOM.classList.remove("active-board");
    }
  }

  renderCell(gameBoard, activeBoard, x, y) {
    const cell = this.doc.createElement("button");

    const status = gameBoard.board[x][y].status;
    if (status === Gameboard.SHIP_CELL && activeBoard) {
      cell.classList.add("ship-cell");
    } else if (status === Gameboard.SHIP_CELL_HIT) {
      cell.classList.add("attacked-ship");
    } else if (status === Gameboard.EMPTY_CELL_HIT) {
      const circle = this.doc.createElement("span");
      circle.classList.add("empty-circle");
      cell.appendChild(circle);

      cell.classList.add("attacked-cell");
    } else if (!activeBoard) {
      const circle = this.doc.createElement("span");
      circle.classList.add("empty-circle-hover");
      cell.appendChild(circle);
    } else {
      cell.classList.add("empty-cell");
    }

    cell.setAttribute("x-coord", x);
    cell.setAttribute("y-coord", y);

    cell.classList.add("board-cell");

    this.attachCellEvents(cell, status, activeBoard);

    return cell;
  }

  attachCellEvents(cell, status, activeBoard) {
    if (
      status === Gameboard.SHIP_CELL &&
      activeBoard &&
      this.gameController.gamePrepping()
    ) {
      this.eventHandler.attachShipDraggingEvent(cell);
      this.eventHandler.attachRotateShipEvent(cell);
    } else if (
      status !== Gameboard.SHIP_CELL_HIT &&
      status !== Gameboard.EMPTY_CELL_HIT &&
      !activeBoard
    ) {
      this.eventHandler.attachHoverInOpponentBoard(cell);
      this.eventHandler.attachHoverOutOpponentBoard(cell);
    }

    if (activeBoard && this.gameController.gamePrepping()) {
      this.eventHandler.attachShipDragDownEvent(cell);
    }

    if (!activeBoard && this.gameController.gameOnGoing()) {
      this.eventHandler.attachCellClickEvent(cell);
    }
  }

  renderPlayerStatus() {
    this.status1.textContent = "";
    this.status2.textContent = "";

    const statusText1 = this.doc.createElement("p");
    const statusText2 = this.doc.createElement("p");

    if (this.gameController.gameEnded()) {
      if (this.gameController.playerOneWon()) {
        statusText1.textContent = "WIN!";
        statusText2.textContent = "LOSE!";

        statusText1.classList.add("success-text");
        statusText2.classList.add("danger-text");
      } else {
        statusText1.textContent = "LOSE!";
        statusText2.textContent = "WIN!";

        statusText1.classList.add("danger-text");
        statusText2.classList.add("success-text");
      }
    } else if (this.gameController.gameOnGoing()) {
      if (this.gameController.firstPlayerTurn())
        statusText1.textContent = "Your turn!";
      else statusText2.textContent = "Your turn!";
    }

    statusText1.classList.add("player-status", "h5");
    statusText2.classList.add("player-status", "h5");

    this.status1.appendChild(statusText1);
    this.status2.appendChild(statusText2);
  }

  renderPlayerInfo() {
    this.player1Score.textContent = this.gameController.score.one;
    this.player2Score.textContent = this.gameController.score.two;
  }

  enablePlayerNameEdit() {
    if (this.gameController.firstPlayerTurn()) {
      this.player1Name.removeAttribute("disabled");
    } else {
      this.player2Name.removeAttribute("disabled");
    }
  }

  disablePlayerNameEdit() {
    this.player1Name.setAttribute("disabled", "");
    this.player2Name.setAttribute("disabled", "");
  }

  renderPlayerName() {
    this.player1Name.value = this.gameController.getPlayerOne().name;
    this.player2Name.value = this.gameController.getPlayerTwo().name;
  }

  renderSelectMode() {
    this.controlsContainer.textContent = "";

    const descMsg = this.createControlsDescMessage("Choose your Opponent");
    const groupBtn = this.createControlGroupBtn();
    const friendBtn = this.doc.createElement("btn");
    const computerBtn = this.doc.createElement("btn");
    const friendText = this.doc.createTextNode("Friend");
    const computerText = this.doc.createTextNode("Computer");
    const friendIcon = this.createIcon("fi-rs-user");
    const computerIcon = this.createIcon("fi-rs-user-robot");

    friendBtn.classList.add("btn", "btn-primary");
    computerBtn.classList.add("btn", "btn-primary");

    this.eventHandler.attachModeEvent(friendBtn, "friend");
    this.eventHandler.attachModeEvent(computerBtn, "computer");

    friendBtn.appendChild(friendIcon);
    friendBtn.appendChild(friendText);
    computerBtn.appendChild(computerIcon);
    computerBtn.appendChild(computerText);

    groupBtn.appendChild(friendBtn);
    groupBtn.appendChild(computerBtn);

    this.controlsContainer.appendChild(descMsg);
    this.controlsContainer.appendChild(groupBtn);
  }

  createControlsDescMessage(msg) {
    const p = this.doc.createElement("p");
    p.textContent = msg;
    p.classList.add("controls-desc");
    return p;
  }

  createControlGroupBtn() {
    const div = this.doc.createElement("div");
    div.classList.add("controls-btn-group");
    return div;
  }

  renderPlacementControls() {
    this.controlsContainer.textContent = "";

    const descMsg = this.createControlsDescMessage(
      "Drag to move. Right Click to rotate."
    );
    const groupBtn = this.createControlGroupBtn();
    const randomBtn = this.doc.createElement("btn");
    const confirmBtn = this.doc.createElement("btn");
    const randomText = this.doc.createTextNode("Random");
    const confirmText = this.doc.createTextNode("");
    const randomIcon = this.createIcon("fi-rr-dice-alt");
    let confirmIcon;

    randomBtn.classList.add("btn", "btn-primary");
    confirmBtn.classList.add("btn", "btn-primary");

    this.eventHandler.attachRandomBtnEvent(randomBtn);
    if (
      this.gameController.friendMode() &&
      !this.gameController.secondPlayerTurn()
    ) {
      confirmText.textContent = "Confirm";
      confirmIcon = this.createIcon("fi-rr-check");
      this.eventHandler.attachConfirmBtnEvent(confirmBtn);
    } else {
      confirmText.textContent = "Start";
      confirmIcon = this.createIcon("fi-rr-play");
      this.eventHandler.attachStartBtnEvent(confirmBtn);
    }

    randomBtn.appendChild(randomIcon);
    randomBtn.appendChild(randomText);
    confirmBtn.appendChild(confirmIcon);
    confirmBtn.appendChild(confirmText);

    groupBtn.appendChild(randomBtn);
    groupBtn.appendChild(confirmBtn);

    this.controlsContainer.appendChild(descMsg);
    this.controlsContainer.appendChild(groupBtn);
  }

  clearControlContainer() {
    this.controlsContainer.textContent = "";
  }

  disablePlays() {
    this.playEnabled = false;
  }
  enablePlays() {
    this.playEnabled = true;
  }

  renderPassButton() {
    this.controlsContainer.textContent = "";

    const passBtn = this.doc.createElement("btn");
    const passIcon = this.createIcon("fi-rr-angle-double-small-right");
    const passText = this.doc.createTextNode("Pass");

    passBtn.classList.add("btn");
    passBtn.classList.add("btn-secondary");

    passBtn.appendChild(passIcon);
    passBtn.appendChild(passText);

    this.eventHandler.attachPassBtnEvent(passBtn);

    this.controlsContainer.appendChild(passBtn);
  }

  renderEndRoundControls() {
    this.controlsContainer.textContent = "";

    const btnGroup = this.createControlGroupBtn();
    const restartRoundBtn = this.doc.createElement("btn");
    const restartGameBtn = this.doc.createElement("btn");
    const restartRoundText = this.doc.createTextNode("Play Again");
    const restartGameText = this.doc.createTextNode("New Game");
    const restartRoundIcon = this.createIcon("fi-rs-rotate-left");
    const restartGameIcon = this.createIcon("fi-rs-house-blank");

    restartRoundBtn.classList.add("btn");
    restartRoundBtn.classList.add("btn-primary");
    restartGameBtn.classList.add("btn");
    restartGameBtn.classList.add("btn-primary");
    restartRoundIcon.classList.add("icon-sm-md");

    this.eventHandler.attachRestartRoundBtnEvent(restartRoundBtn);
    this.eventHandler.attachRestartGameBtnEvent(restartGameBtn);

    restartRoundBtn.appendChild(restartRoundIcon);
    restartRoundBtn.appendChild(restartRoundText);
    restartGameBtn.appendChild(restartGameIcon);
    restartGameBtn.appendChild(restartGameText);

    btnGroup.appendChild(restartRoundBtn);
    btnGroup.appendChild(restartGameBtn);

    this.controlsContainer.appendChild(btnGroup);
  }

  renderSwitchingWindow() {
    this.switchContainer.classList.remove("d-none");
    this.switchScreen = true;
    this.render();
  }

  renderAttackMsg() {
    this.controlsContainer.textContent = "";
    const descMsg = this.createControlsDescMessage("Waiting attack...");
    descMsg.classList.add("h4");

    this.controlsContainer.appendChild(descMsg);
  }

  hideSwitchingWindow() {
    this.switchContainer.classList.add("d-none");
    this.switchScreen = false;
  }

  hideBoards() {
    this.gameBoardContainer.classList.add("d-none");
  }

  showBoards() {
    this.gameBoardContainer.classList.remove("d-none");
  }

  renderEndGame() {
    this.endGameMsg.textContent = `Player ${this.gameController.winner} has won!`;
    this.endGameContainer.classList.remove("d-none");
  }

  createIcon(type) {
    const i = this.doc.createElement("i");
    i.classList.add("fi", "icon", type);
    return i;
  }

  // Game methods
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

  playTurn(coords) {
    if (!this.playEnabled) return;

    const attack = this.gameController.playTurn(coords);
    const board =
      this.gameController.player[this.gameController.currentTurn].board;

    // rendering
    this.getCell(this.gameController.currentTurn, coords).replaceWith(
      this.renderCell(board, false, coords[0], coords[1])
    );

    if (
      attack.success &&
      this.gameController.friendMode() &&
      this.gameController.gameOnGoing()
    ) {
      this.disablePlays();
      this.renderPassButton();
    } else {
      this.render();
    }
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
}
