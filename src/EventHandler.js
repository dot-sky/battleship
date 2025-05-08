import { GameController } from "./GameController";

export class EventHandler {
  constructor(screenController) {
    this.screenController = screenController;

    this.dragStartCell = [];
    this.dragEndCell = [];
  }

  addEvents() {
    this.screenController.randomizerBtn.addEventListener("click", () => {
      this.randomBtnClick();
    });
  }

  randomBtnClick() {
    this.screenController.gameController.randomizeBoards();

    this.screenController.render();
  }

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

  attachShipDragDownEvent(cell) {
    cell.addEventListener("mouseup", () => this.dropDrag(cell));
  }

  startDrag(cell) {
    this.dragStartCell = [
      cell.getAttribute("x-coord"),
      cell.getAttribute("y-coord"),
    ];
  }

  dropDrag(cell) {
    this.dragEndCell = [
      cell.getAttribute("x-coord"),
      cell.getAttribute("y-coord"),
    ];
    if (this.dragStartCell.length === 2) {
      this.screenController.moveShip(this.dragStartCell, this.dragEndCell);
      console.log(this.dragStartCell, this.dragEndCell);
    }
    this.dragStartCell = [];
  }
}
