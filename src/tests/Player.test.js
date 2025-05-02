import { Player } from "../Player.js";
test("Player of type real and computer", () => {
  const player = new Player("real");
  const computer = new Player("computer");
  expect(player.type).toBe("real");
  expect(computer.type).toBe("computer");
});

test("Player has it's own board", () => {
  const player = new Player("real");
  player.board.place("submarine", [3, 4], "right");
  player.board.receiveAttack([3, 4]);
  player.board.receiveAttack([3, 5]);
  player.board.receiveAttack([3, 6]);
  expect(player.board.allShipsSunk()).toBe(true);
});
