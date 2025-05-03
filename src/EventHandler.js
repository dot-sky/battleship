export class EventHandler {
  constructor(screenController) {
    this.screenController = screenController;
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
}
