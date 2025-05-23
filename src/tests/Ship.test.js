import { Ship } from "../models/Ship.js";

test("Destroyer ship has correct attributes", () => {
  const expected = {
    type: "destroyer",
    length: 3,
    hits: 0,
    sunk: false,
  };
  const received = new Ship("destroyer");
  expect(received).toEqual(expected);
});

test("Carrier ship has correct attributes", () => {
  const expected = {
    type: "carrier",
    length: 5,
    hits: 0,
    sunk: false,
  };
  const received = new Ship("carrier");
  expect(received).toEqual(expected);
});

test("Unknown ship has correct attributes", () => {
  const expected = {
    type: "none",
    length: 0,
    hits: 0,
    sunk: false,
  };
  const received = new Ship("none");
  expect(received).toEqual(expected);
});

test("Ship correctly receives hits", () => {
  const received = new Ship("carrier");
  received.hit();
  received.hit();
  received.hit();
  expect(received.hits).toBe(3);
});

test("Destroyer ship is sunk after enough hits", () => {
  const received = new Ship("destroyer");
  received.hit();
  received.hit();
  received.hit();
  expect(received.isSunk()).toBe(true);
});

test("Carrier ship is not sunk after 3 hits", () => {
  const received = new Ship("carrier");
  received.hit();
  received.hit();
  received.hit();
  expect(received.isSunk()).toBe(false);
});
