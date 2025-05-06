export class ComputerDriver {
  static #MODE = { RANDOM: 0, SHIP_HUNT: 1 };
  constructor(board, gameController) {
    this.board = board;
    this.mode = ComputerDriver.#MODE.RANDOM;
    this.gameController = gameController;
  }

  play() {
    if (this.mode === ComputerDriver.#MODE.RANDOM) {
      this.playRandom();
    } else {
      this.followShipHunt();
    }
  }

  playRandom() {
    const coords = this.getRandomCoords();
    const attack = this.gameController.playTurn(coords);

    if (attack.hit) this.startShipHunt(coords);
  }

  followShipHunt() {
    let coords;
    // check if next move has the possibility to hit the ship
    do {
      if (this.nextMoves.length === 0) {
        this.switchMode();
        this.playRandom();
        return;
      }

      coords = this.nextMoves[0];
      this.nextMoves.shift();
    } while (
      this.shipDirection &&
      !this.inDirection(this.firstHit, coords, this.shipDirection)
    );

    const attack = this.gameController.playTurn(coords);

    if (attack.hit) {
      if (!this.shipDirection)
        this.shipDirection = this.getDirection(coords, this.firstHit);

      this.addAdjacentCells(coords);
    }

    // if no more moves are possible switch to random
    if (this.nextMoves.length === 0) this.switchMode();
  }

  startShipHunt(coord) {
    this.nextMoves = [];
    this.shipDirection = null;
    this.firstHit = coord;
    this.mode = ComputerDriver.#MODE.SHIP_HUNT;

    this.addAdjacentCells(coord);
  }

  addAdjacentCells(coord) {
    const x = coord[0];
    const y = coord[1];
    const adjacent = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    // Randomize the order of added adjacent cells
    this.shuffle(adjacent);

    for (let coords of adjacent) {
      if (this.board.isAttackable(coords)) this.nextMoves.push(coords);
    }
  }

  switchMode() {
    if (this.mode === ComputerDriver.#MODE.RANDOM)
      this.mode = ComputerDriver.#MODE.SHIP_HUNT;
    else this.mode = ComputerDriver.#MODE.RANDOM;
  }

  // Direction methods
  inDirection(cellA, cellB, direction) {
    return (
      (cellA[0] === cellB[0] && direction === "horizontal") ||
      (cellA[1] === cellB[1] && direction === "vertical")
    );
  }

  getDirection(cellA, cellB) {
    if (cellA[0] === cellB[0]) return "horizontal";
    else if (cellA[1] === cellB[1]) return "vertical";
    else null;
  }

  // Random play methods
  getRandomCoords() {
    const x = this.getRandomInt(this.board.size);
    const y = this.getRandomInt(this.board.size);

    return [x, y];
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
