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

    // this.screenController.restartRoundBtn.addEventListener("click", () => {
    //   this.restartRoundBtnClick();
    // });
    // this.screenController.restartGameBtn.addEventListener("click", () => {
    //   this.restartGameBtnClick();
    // });
  }

  restartRoundBtnClick() {
    this.screenController.gameController.restartRound();
    this.screenController.render();
  }

  restartGameBtnClick() {
    this.screenController.gameController.resetGame();
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
    btn.addEventListener("click", () =>
      this.screenController.confirmPlacement()
    );
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
