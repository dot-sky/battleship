import { Gameboard } from "../gameboard.js";
import { Ship } from "../ship.js";
test("Empty gameboard is properly filled", () => {
  const expected = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      row.push({ status: 0, ship: null });
    }
    expected.push(row);
  }
  const received = new Gameboard();

  expect(received.board).toEqual(expected);
});

test("Place carrier at specified coordinates", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  const received = gameboard.place("carrier", head, direction);

  expect(received).toBe(true);
});

test("Ships can't share same coordinates", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  gameboard.place("carrier", head, direction);
  const received = gameboard.place("submarine", head, direction);

  expect(received).toBe(false);
});

test("Hits same carrier ship", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  gameboard.place("carrier", head, direction);

  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 5]);
  gameboard.receiveAttack([3, 7]);
  gameboard.receiveAttack([3, 8]);

  expect(gameboard.board[head[0]][head[1]].ship.hits).toBe(4);
});

test("Can't hit ship twice in the same position", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  gameboard.place("carrier", head, direction);

  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 8]);
  gameboard.receiveAttack([3, 8]);
  gameboard.receiveAttack([23, 8]);

  expect(gameboard.board[head[0]][head[1]].ship.hits).toBe(2);
});

test("All ships aren't sunk", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  gameboard.place("carrier", head, direction);
  gameboard.place("submarine", [6, 4], direction);

  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 5]);
  gameboard.receiveAttack([3, 6]);
  gameboard.receiveAttack([3, 7]);
  gameboard.receiveAttack([3, 8]);

  gameboard.receiveAttack([6, 4]);

  expect(gameboard.allShipsSunk()).toBe(false);
});

test("All ships are sunk", () => {
  const gameboard = new Gameboard();
  const head = [3, 4];
  const direction = [0, 1];
  gameboard.place("carrier", head, direction);
  gameboard.place("submarine", [6, 4], direction);

  gameboard.receiveAttack([3, 4]);
  gameboard.receiveAttack([3, 5]);
  gameboard.receiveAttack([3, 6]);
  gameboard.receiveAttack([3, 7]);
  gameboard.receiveAttack([3, 8]);

  gameboard.receiveAttack([6, 4]);
  gameboard.receiveAttack([6, 5]);
  gameboard.receiveAttack([6, 6]);

  expect(gameboard.allShipsSunk()).toBe(true);
});
