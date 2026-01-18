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

const inputTelephone = document.getElementById("input-telephone");

const releaseButton = document.getElementById("btn-release");
const rerollButton = document.getElementById("btn-reroll");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const style = getComputedStyle(canvas);

const ball = spawnBall();

function main() {
  createPegs();
  createHoles();

  ctx.font = "bold 16px monospace";

  releaseButton.addEventListener("click", () => {
    ball.release();
  });

  rerollButton.addEventListener("click", () => {
    createHoles();
  });

  window.setInterval(update, interval);
}

/* Creates the pegs on the board */
function createPegs() {
  pegs.length = 0;

  const color = style.getPropertyValue("--plinko-peg");

  for (let dy = 0; dy < 16; ++dy) {
    const y = 32 + 16 * dy;

    let bx = halfWidth - pegDist * (pegCount / 2);
    if (dy % 2 === 0) {
      bx += pegDist / 2;
    }

    for (let dx = 0; dx < pegCount + (dy % 2); ++dx) {
      const x = bx + pegDist * dx;
      pegs.push(new Ball(x, y, 2, 100, color));
    }
  }
}

/* Creates the holes on the board */
function createHoles() {
  holes.length = 0;

  const coords = [];
  const bx = halfWidth - holeWidth * (holeCount / 2);
  for (let dx = 0; dx < holeCount; ++dx) {
    const x = bx + holeWidth * dx;
    coords.push(x);
  }

  shuffleArray(coords);

  let i;

  /* Numbers */
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers);
  for (i = 0; i < 4; ++i) {
    holes.push(createNumberHole(coords[i], numbers[i]));
  }

  /* Blank */
  holes.push(createBlankHole(coords[i++]));

  /* Erase */
  holes.push(createEraseHole(coords[i++]));

  /* Bomb */
  holes.push(createBombHole(coords[i++]));

  /* Submit */
  holes.push(createSubmitHole(coords[i++]));
}

/* Fisher-Yates shuffle */
function shuffleArray(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* Creates a new hole with a number */
function createNumberHole(x, number) {
  const callback = () => {
    inputTelephone.value += number;
  };

  const fontColor = style.getPropertyValue("--font-hole-number");
  const bgColor = style.getPropertyValue("--bg-hole-number");
  const borderColor = style.getPropertyValue("--border-hole-number");

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    number.toString(),
    fontColor,
    bgColor,
    borderColor,
    callback,
  );
}

/* Creates a new hole that does nothing */
function createBlankHole(x) {
  const callback = () => {};

  const fontColor = style.getPropertyValue("--font-hole-blank");
  const bgColor = style.getPropertyValue("--bg-hole-blank");
  const borderColor = style.getPropertyValue("--border-hole-blank");

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    "",
    fontColor,
    bgColor,
    borderColor,
    callback,
  );
}

/* Creates a new hole that erases a single character */
function createEraseHole(x) {
  const callback = () => {
    if (inputTelephone.value !== "") {
      inputTelephone.value = inputTelephone.value.slice(0, -1);
    }
  };

  const fontColor = style.getPropertyValue("--font-hole-erase");
  const bgColor = style.getPropertyValue("--bg-hole-erase");
  const borderColor = style.getPropertyValue("--border-hole-erase");

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    "❌",
    fontColor,
    bgColor,
    borderColor,
    callback,
  );
}

/* Creates a new hole that erases the hole thing!!!*/
function createBombHole(x) {
  const callback = () => {
    inputTelephone.value = "";
  };

  const fontColor = style.getPropertyValue("--font-hole-bomb");
  const bgColor = style.getPropertyValue("--bg-hole-bomb");
  const borderColor = style.getPropertyValue("--border-hole-bomb");

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    "💣",
    fontColor,
    bgColor,
    borderColor,
    callback,
  );
}

/* Creates a new hole that submits the form */
function createSubmitHole(x) {
  const callback = () => {
    inputTelephone.value = "";
  };

  const fontColor = style.getPropertyValue("--font-hole-submit");
  const bgColor = style.getPropertyValue("--bg-hole-submit");
  const borderColor = style.getPropertyValue("--border-hole-submit");

  return new Hole(
    x,
    holeY,
    holeWidth,
    holeHeight,
    "✅",
    fontColor,
    bgColor,
    borderColor,
    callback,
  );
}

/* Spawns the ball in */
function spawnBall() {
  const color = style.getPropertyValue("--plinko-ball");
  const vectorColor = style.getPropertyValue("--plinko-ball-vector");

  return new Ball(320, 8, 4, 50, color, vectorColor);
}

/* Main loop */
function update() {
  ctx.clearRect(0, 0, 640, 480);

  ball.update(0.1667);

  ball.draw(ctx);
  ball.drawVector(ctx);

  for (const peg of pegs) {
    peg.draw(ctx);
  }
  for (const hole of holes) {
    hole.draw(ctx);
  }
}

main();
