import { GameController } from "./GameController";

export class EventHandler {
  constructor(screenController) {
    this.screenController = screenController;

    this.dragStartCell = [];
    this.dragEndCell = [];
  }
  // Onload Events
  addEvents() {
    // Switching Window
    this.screenController.closeSwitchBtn.addEventListener("click", () => {
      this.closeSwitchBtnClick();
    });
    this.screenController.player1Name.addEventListener("input", (event) =>
      this.validateName(event.target)
    );
    this.screenController.player2Name.addEventListener("input", (event) =>
      this.validateName(event.target)
    );
  }

  attachRestartRoundBtnEvent(btn) {
    btn.addEventListener("click", () => this.restartRoundBtnClick());
  }

  attachRestartGameBtnEvent(btn) {
    btn.addEventListener("click", () => this.restartGameBtnClick());
  }

  restartRoundBtnClick() {
    this.screenController.gameController.restartRound();
    this.screenController.render();
  }

  restartGameBtnClick() {
    this.screenController.gameController.resetGame();
    this.screenController;
    this.screenController.render();
  }

  closeSwitchBtnClick() {
    this.screenController.hideSwitchingWindow();
    this.screenController.enablePlays();
    this.screenController.render();
  }

  // end ... Onload Events

  // Mode Selection
  attachModeEvent(btn, mode) {
    btn.addEventListener("click", () => this.modeBtnClick(mode));
  }

  modeBtnClick(mode) {
    this.screenController.gameController.selectMode(mode);
    this.screenController.gameController.startPrep();
    this.screenController.render();
  }

  // Positioning
  attachRandomBtnEvent(btn) {
    btn.addEventListener("click", () => this.randomBtnClick());
  }

  attachConfirmBtnEvent(btn) {
    btn.addEventListener("click", () => this.confirmPreparation());
  }

  confirmPreparation() {
    this.setCurrentPlayerName();

    this.screenController.renderSwitchingWindow();
    this.screenController.gameController.switchPlayer();
    this.screenController.render();
  }

  setCurrentPlayerName() {
    if (
      this.screenController.gameController.firstPlayerTurn() &&
      this.validName(this.screenController.player1Name.value)
    ) {
      this.screenController.gameController.getPlayerOne().name =
        this.screenController.player1Name.value;
    } else if (
      this.screenController.gameController.secondPlayerTurn() &&
      this.validName(this.screenController.player2Name.value)
    ) {
      this.screenController.gameController.getPlayerTwo().name =
        this.screenController.player2Name.value;
    }
  }

  validateName(input) {
    const value = input.value;
    if (this.validName(value)) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity("Please enter a name (1 to 15 characters long)");
      input.reportValidity();
    }
  }

  validName(value) {
    return value.length > 0 && value.length <= 20;
  }

  randomBtnClick() {
    this.screenController.gameController.randomizeCurrentBoard();
    this.screenController.render();
  }

  //  Game Controls
  attachStartBtnEvent(btn) {
    btn.addEventListener("click", () => this.startGame());
  }

  startGame() {
    this.setCurrentPlayerName();

    this.screenController.startGame();
    this.screenController.render();
  }

  attachPassBtnEvent(btn) {
    btn.addEventListener("click", () => this.passTurn());
  }

  passTurn() {
    this.screenController.renderSwitchingWindow();
  }

  // Cell Clicks
  attachCellClickEvent(cell) {
    cell.addEventListener("click", () => this.cellClick(cell));
  }

  cellClick(cell) {
    this.screenController.playTurn([
      cell.getAttribute("x-coord"),
      cell.getAttribute("y-coord"),
    ]);
    // this.screenController.renderCell();
  }

  // Moving ships
  attachShipDraggingEvent(cell) {
    cell.addEventListener("mousedown", () => this.startDrag(cell));
  }

  attachRotateShipEvent(cell) {
    cell.addEventListener("contextmenu", (event) =>
      this.rotateShipCell(event, cell)
    );
  }

  attachShipDragDownEvent(cell) {
    cell.addEventListener("mouseup", () => this.dropDrag(cell));
  }

  rotateShipCell(ev, cell) {
    ev.preventDefault();
    this.screenController.rotateShip(this.getCoordsFromCell(cell));
  }

  startDrag(cell) {
    this.dragStartCell = this.getCoordsFromCell(cell);
  }

  dropDrag(cell) {
    this.dragEndCell = this.getCoordsFromCell(cell);

    if (this.dragStartCell.length === 2) {
      this.screenController.moveShip(this.dragStartCell, this.dragEndCell);
    }
    this.dragStartCell = [];
  }

  // Visual Events
  attachHoverInOpponentBoard(cell) {
    cell.addEventListener("mouseover", () => this.showEmptyCellCircle(cell));
  }

  attachHoverOutOpponentBoard(cell) {
    cell.addEventListener("mouseout", () => this.hideEmptyCellCircle(cell));
  }

  showEmptyCellCircle(cell) {
    const circle = cell.children[0];
    circle.classList.add("d-flex");
    circle.classList.remove("d-none");
  }

  hideEmptyCellCircle(cell) {
    const circle = cell.children[0];
    circle.classList.add("d-none");
    circle.classList.remove("d-flex");
  }
  //
  getCoordsFromCell(cell) {
    return [cell.getAttribute("x-coord"), cell.getAttribute("y-coord")];
  }
}
