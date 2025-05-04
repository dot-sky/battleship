export class ComputerDriver {
  static #MODE = { RANDOM: 0, SHIP_HUNT: 1 };
  constructor(board) {
    this.board = board;
    this.mode = ComputerDriver.#MODE.RANDOM;
  }

  playCoords() {
    let coords;
    if (this.mode === ComputerDriver.#MODE.RANDOM) {
      coords = this.playRandom();
    } else if (this.mode === ComputerDriver.#MODE.SHIP_HUNT) {
      coords = this.followShipHunt();
    }
    return coords;
  }

  playRandom() {
    const x = this.getRandomInt(this.board.size);
    const y = this.getRandomInt(this.board.size);

    return [x, y];
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}
