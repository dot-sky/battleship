import { GameController } from "../GameController.js";

test("Players are created and have a random populated board", () => {
  const game = new GameController();
  expect(game.player.one.type).toBe("real");
  expect(game.player.two.type).toBe("computer");
});

test("Player turn is changed after a play", () => {
  const game = new GameController();
  game.playTurn([2, 6]);
  expect(game.currentTurn).toBe("two");
  game.playTurn([0, 2]);
  expect(game.currentTurn).toBe("one");
  game.playTurn([2, 7]);
  expect(game.currentTurn).toBe("two");
  game.playTurn([0, 1]);
  expect(game.currentTurn).toBe("one");
});

test("Player can't attack the same cell twice", () => {
  const game = new GameController();
  game.playTurn([2, 6]);
  game.playTurn([0, 1]);
  game.playTurn([2, 7]);

  expect(game.playTurn([0, 1])).toBe(false);
});

test("Player 1 wins", () => {
  const game = new GameController();
  game.playTurn([2, 5]);
  game.playTurn([0, 1]);
  game.playTurn([2, 6]);
  game.playTurn([0, 2]);
  game.playTurn([2, 7]);
  game.playTurn([0, 3]);
  game.playTurn([7, 1]);
  game.playTurn([0, 4]);
  game.playTurn([7, 2]);

  expect(game.winner).toBe("one");
});

test("Player 2 wins", () => {
  const game = new GameController();
  game.playTurn([0, 9]);
  game.playTurn([6, 2]);
  game.playTurn([0, 1]);
  game.playTurn([7, 2]);
  game.playTurn([0, 2]);
  game.playTurn([8, 2]);
  game.playTurn([0, 3]);
  game.playTurn([7, 6]);
  game.playTurn([0, 4]);
  game.playTurn([7, 7]);
  expect(game.winner).toBe("two");
});
