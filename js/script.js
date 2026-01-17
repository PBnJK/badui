/* Plinko
 * Main script
 */

"use strict";

const FPS = 60;
const interval = 1000.0 / FPS;

const width = 640;
const halfWidth = width / 2;
const height = 480;
const halfHeight = height / 2;

const pegDist = 16;
const pegCount = 16;

const holeWidth = 32;
const holeHeight = 64;
const holeCount = 8;
const holeY = 304;

const pegs = [];
const holes = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = spawnBall();

const style = getComputedStyle(canvas);

function main() {
  createPegs();
  createHoles();

  ctx.font = "bold 16px monospace";

  window.setInterval(update, interval);
}

/* Creates the pegs on the board */
function createPegs() {
  pegs.length = 0;

  for (let dy = 0; dy < 16; ++dy) {
    const y = 32 + 16 * dy;

    let bx = halfWidth - pegDist * (pegCount / 2);
    if (dy % 2 === 0) {
      bx += pegDist / 2;
    }

    for (let dx = 0; dx < pegCount + (dy % 2); ++dx) {
      const x = bx + pegDist * dx;
      pegs.push(new Ball(x, y, 2, 100, "grey"));
    }
  }
}

/* Creates the holes on the board */
function createHoles() {
  const bx = halfWidth - holeWidth * (holeCount / 2);
  for (let dx = 0; dx < holeCount; ++dx) {
    const x = bx + holeWidth * dx;
    holes.push(createNumberHole(x, 2));
  }
}

/* Creates a new hole with a number */
function createNumberHole(x, number) {
  const callback = () => {
    console.log(number);
  };

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    number.toString(),
    style.getPropertyValue("--font-hole-number"),
    style.getPropertyValue("--bg-hole-number"),
    callback,
  );
}

/* Spawns the ball in */
function spawnBall() {
  const ball = new Ball(320, 4, 4, 50, "red");
  ball.addRandomBias();

  return ball;
}

/* Main loop */
function update() {
  ctx.clearRect(0, 0, 640, 480);

  ball.update(0.1667);

  ball.draw(ctx);
  for (const peg of pegs) {
    peg.draw(ctx);
  }
  for (const hole of holes) {
    hole.draw(ctx);
  }
}

main();
