import { Ship } from "./ship";

export class Gameboard {
  static #BOARD_SIZE = 10;
  static #EMPTY_CELL = 0;
  static #EMPTY_CELL_HIT = 1;
  static #SHIP_CELL = 2;
  static #SHIP_CELL_HIT = 3;

  static #direction = {
    up: [-1, 0],
    down: [1, 0],
    right: [0, 1],
    left: [0, -1],
  };

  constructor() {
    this.resetBoard(Gameboard.#BOARD_SIZE);
    this.ships = [];
  }

  resetBoard(size) {
    this.board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push({ status: Gameboard.#EMPTY_CELL, ship: null });
      }
      this.board.push(row);
    }
  }

  place(shipType, head, directionKey) {
    let placed = false;
    let direction =
      Gameboard.#direction[directionKey] ?? Gameboard.#direction.right;

    const ship = new Ship(shipType);
    this.ships.push(ship);

    if (this.validPlacement(head, ship.length, direction)) {
      let x = head[0];
      let y = head[1];

      for (let i = 0; i < ship.length; i++) {
        this.board[x][y].status = Gameboard.#SHIP_CELL;
        this.board[x][y].ship = ship;

        x += direction[0];
        y += direction[1];
      }

      placed = true;
    }
    return placed;
  }

  receiveAttack(coord) {
    if (!this.isValidCoord(coord)) return;

    const cell = this.board[coord[0]][coord[1]];

    if (cell.status === Gameboard.#EMPTY_CELL) {
      cell.status = Gameboard.#EMPTY_CELL_HIT;
    } else if (cell.status === Gameboard.#SHIP_CELL) {
      cell.ship.hit();
      cell.status = Gameboard.#SHIP_CELL_HIT;
    }
  }

  allShipsSunk() {
    for (let ship of this.ships) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  validPlacement(head, length, direction) {
    let coord = [...head];

    for (let i = 0; i < length; i++) {
      if (
        !this.isValidCoord(coord) ||
        this.board[coord[0]][coord[1]].status !== Gameboard.#EMPTY_CELL
      )
        return false;

      coord[0] += direction[0];
      coord[1] += direction[1];
    }

    return true;
  }

  isValidCoord(coord) {
    return (
      coord[0] >= 0 &&
      coord[0] < Gameboard.#BOARD_SIZE &&
      coord[1] >= 0 &&
      coord[1] < Gameboard.#BOARD_SIZE
    );
  }
}
