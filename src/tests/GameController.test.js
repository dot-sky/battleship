import { GameController } from "../controllers/GameController.js";

test("Player turn is changed after a play", () => {
  const game = new GameController();
  game.getPlayerOne().board.defaultOne();
  game.getPlayerTwo().board.defaultTwo();
  game.startPrep();
  game.startGame();
  game.playTurn([2, 4]);
  expect(game.currentTurn).toBe("two");
  game.playTurn([0, 0]);
  expect(game.currentTurn).toBe("one");
  game.playTurn([2, 3]);
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
