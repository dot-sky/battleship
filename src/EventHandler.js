import { GameController } from "./GameController";

export class EventHandler {
  constructor(screenController) {
    this.screenController = screenController;

    this.dragStartCell = [];
    this.dragEndCell = [];
  }
  // Onload Events
  addEvents() {
    this.screenController.modeBtn.addEventListener("click", () => {
      this.modeBtnClick();
    });
    this.screenController.randomizerBtn.addEventListener("click", () => {
      this.randomBtnClick();
    });
    this.screenController.startBtn.addEventListener("click", () => {
      this.startBtnClick();
    });
    this.screenController.restartRoundBtn.addEventListener("click", () => {
      this.restartRoundBtnClick();
    });
    this.screenController.restartGameBtn.addEventListener("click", () => {
      this.restartGameBtnClick();
    });
  }

  randomBtnClick() {
    this.screenController.gameController.randomizeBoards();

    this.screenController.render();
  }

  startBtnClick() {
    this.screenController.gameController.startGame();
    this.screenController.render();
  }

  restartRoundBtnClick() {
    this.screenController.gameController.restartRound();
    this.screenController.render();
  }

  restartGameBtnClick() {
    this.screenController.gameController.resetGame();
    this.screenController.render();
  }

  modeBtnClick() {
    const mode = this.screenController.computerInput.checked
      ? this.screenController.computerInput.value
      : this.screenController.friendInput.value;
    this.screenController.gameController.selectMode(mode);
    this.screenController.gameController.startPrep();
    this.screenController.render();
  }
  // end ... Onload Events

  attachCellClickEvent(cell) {
    cell.addEventListener("click", () => this.cellClick(cell));
  }

  cellClick(cell) {
    this.screenController.gameController.playTurn([
      cell.getAttribute("x-coord"),
      cell.getAttribute("y-coord"),
    ]);

    this.screenController.render();
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
  //
  getCoordsFromCell(cell) {
    return [cell.getAttribute("x-coord"), cell.getAttribute("y-coord")];
  }
}
