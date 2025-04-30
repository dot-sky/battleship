export class Ship {
  static #lengths = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    boat: 2,
  };

  constructor(type) {
    this.hits = 0;
    this.sunk = false;
    this.type = type;
    this.length = Ship.#lengths[type] ?? 0;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
