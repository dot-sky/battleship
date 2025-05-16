import { Ship } from "./Ship.js";

export class Gameboard {
  static #DEFAULT_SIZE = 10;
  static EMPTY_CELL = 0;
  static EMPTY_CELL_HIT = 1;
  static SHIP_CELL = 2;
  static SHIP_CELL_HIT = 3;

  static #direction = {
    up: [-1, 0],
    down: [1, 0],
    right: [0, 1],
    left: [0, -1],
  };

  constructor() {
    this.size = Gameboard.#DEFAULT_SIZE;

    this.resetBoard(this.size);
  }

  resetBoard(size) {
    this.board = [];
    this.ships = [];

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push({ status: Gameboard.EMPTY_CELL, ship: null });
      }
      this.board.push(row);
    }
  }

  // Ship placement
  place(shipType, head, directionKey) {
    let placed = false;
    let direction =
      Gameboard.#direction[directionKey] ?? Gameboard.#direction.right;

    const ship = new Ship(shipType);

    if (this.validPlacement(head, ship.length, direction)) {
      this.placeShip(head, ship, direction);

      this.ships.push({ ship, head, direction });
      placed = true;
    }

    return placed;
  }

  placeShip(head, ship, direction) {
    let x = head[0];
    let y = head[1];

    for (let i = 0; i < ship.length; i++) {
      this.board[x][y].status = Gameboard.SHIP_CELL;
      this.board[x][y].ship = ship;

      x += direction[0];
      y += direction[1];
    }
  }

  move(initialCell, finalCell) {
    const shipInfo = this.getShipInfo(initialCell);

    const diff = this.coordDifference(initialCell, finalCell);
    const newHead = [shipInfo.head[0] + diff[0], shipInfo.head[1] + diff[1]];

    this.moveShip(shipInfo, newHead);
  }

  rotateShip(shipCoord) {
    const shipInfo = this.getShipInfo(shipCoord);
    const shift = Math.floor(shipInfo.ship.length / 2);

    const newDirection = this.rotateDirection(shipInfo.direction);
    let newHead;
    if (
      this.sameDirection(shipInfo.direction, Gameboard.#direction.down) ||
      this.sameDirection(shipInfo.direction, Gameboard.#direction.right)
    ) {
      newHead = [shipInfo.head[0] + shift, shipInfo.head[1] + shift];
    } else {
      newHead = [shipInfo.head[0] - shift, shipInfo.head[1] - shift];
    }

    this.moveShip(shipInfo, newHead, newDirection);
  }

  moveShip(shipInfo, newHead, direction = shipInfo.direction) {
    let moved = false;
    const ship = shipInfo.ship;

    if (this.validMove(newHead, ship.length, direction, ship)) {
      this.removeShipCells(shipInfo);
      this.placeShip(newHead, ship, direction);

      shipInfo.head = newHead;
      shipInfo.direction = direction;

      moved = true;
    }

    return moved;
  }

  removeShipCells(shipInfo) {
    let x = shipInfo.head[0];
    let y = shipInfo.head[1];

    for (let i = 0; i < shipInfo.ship.length; i++) {
      this.board[x][y].status = Gameboard.EMPTY_CELL;
      this.board[x][y].ship = null;

      x += shipInfo.direction[0];
      y += shipInfo.direction[1];
    }
  }

  getShipInfo(coords) {
    const ship = this.board[coords[0]][coords[1]].ship;
    for (let shipInfo of this.ships) {
      if (Object.is(shipInfo.ship, ship)) {
        return shipInfo;
      }
    }
    return null;
  }

  receiveAttack(coord) {
    if (!this.isAttackable(coord)) return { success: false, hit: false };

    const cell = this.board[coord[0]][coord[1]];

    const attack = { success: true, hit: false };

    if (cell.status === Gameboard.EMPTY_CELL) {
      cell.status = Gameboard.EMPTY_CELL_HIT;
    } else if (cell.status === Gameboard.SHIP_CELL) {
      cell.ship.hit();
      cell.status = Gameboard.SHIP_CELL_HIT;

      attack.hit = true;
    }

    return attack;
  }

  allShipsSunk() {
    for (let shipInfo of this.ships) {
      if (!shipInfo.ship.isSunk()) return false;
    }
    return true;
  }

  validPlacement(head, length, direction) {
    let coord = [...head];

    for (let i = 0; i < length; i++) {
      if (
        !this.isValidCoord(coord) ||
        this.board[coord[0]][coord[1]].status !== Gameboard.EMPTY_CELL ||
        this.nearShip(coord)
      )
        return false;

      coord[0] += direction[0];
      coord[1] += direction[1];
    }

    return true;
  }

  validMove(head, length, direction, ship) {
    let coord = [...head];
    let cell;

    for (let i = 0; i < length; i++) {
      if (
        !this.isValidCoord(coord) ||
        (this.board[coord[0]][coord[1]].status !== Gameboard.EMPTY_CELL &&
          !Object.is(this.board[coord[0]][coord[1]].ship, ship))
      )
        return false;

      coord[0] += direction[0];
      coord[1] += direction[1];
    }

    return true;
  }

  // Coords
  isCoordHit(coord) {
    return (
      this.board[coord[0]][coord[1]].status === Gameboard.EMPTY_CELL_HIT ||
      this.board[coord[0]][coord[1]].status === Gameboard.SHIP_CELL_HIT
    );
  }

  isValidCoord(coord) {
    return (
      coord[0] >= 0 &&
      coord[0] < this.size &&
      coord[1] >= 0 &&
      coord[1] < this.size
    );
  }

  coordDifference(coordA, coordB) {
    return [coordB[0] - coordA[0], coordB[1] - coordA[1]];
  }

  isAttackable(coord) {
    return this.isValidCoord(coord) && !this.isCoordHit(coord);
  }

  nearShip(coord) {
    const x = coord[0];
    const y = coord[1];

    return (
      (this.isValidCoord([x + 1, y]) &&
        this.board[x + 1][y].status === Gameboard.SHIP_CELL) ||
      (this.isValidCoord([x - 1, y]) &&
        this.board[x - 1][y].status === Gameboard.SHIP_CELL) ||
      (this.isValidCoord([x, y + 1]) &&
        this.board[x][y + 1].status === Gameboard.SHIP_CELL) ||
      (this.isValidCoord([x, y - 1]) &&
        this.board[x][y - 1].status === Gameboard.SHIP_CELL)
    );
  }

  sameDirection(dirA, dirB) {
    return dirA[0] === dirB[0] && dirA[1] === dirB[1];
  }

  rotateDirection(direction) {
    return [direction[1] * -1, direction[0] * -1];
  }

  randomBoardPlacement() {
    this.resetBoard(this.size);
    // this.randomPlace("carrier");
    // this.randomPlace("battleship");
    // this.randomPlace("destroyer");
    this.randomPlace("submarine");
    // this.randomPlace("boat");
  }

  randomPlace(type) {
    let x, y, directionKey, placed;
    const directions = Object.keys(Gameboard.#direction);

    do {
      x = this.getRandomInt(this.size);
      y = this.getRandomInt(this.size);
      directionKey = this.getRandomInt(directions.length);

      placed = this.place(type, [x, y], directions[directionKey]);
    } while (!placed);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Default boards
  defaultOne() {
    // this.place("battleship", [3, 4], "right");
    this.place("destroyer", [6, 2], "down");
    this.place("boat", [7, 6], "right");
  }

  defaultTwo() {
    this.place("battleship", [1, 0], "down");
    this.place("destroyer", [2, 5], "right");
    this.place("boat", [7, 1], "right");
  }
}
