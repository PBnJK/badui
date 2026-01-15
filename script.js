/* Main Plinko Script */

const GRAVITY = 0.5;

/* A generic sphere collider */
class SphereCollider {
  /**
   * SphereCollider constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radius2 = this.radius * this.radius;
  }

  /**
   * Checks SphereCollider with SphereCollider collision
   *
   * @param {SphereCollider} sphere
   */
  isCollidingWithSphere(sphere) {
    const xdist = sphere.x - this.x;
    const ydist = sphere.y - this.y;
    const distance = xdist * xdist + ydist * ydist;

    const r = (this.radius + sphere.radius) * 2;
    return distance <= r;
  }

  /**
   * Checks SphereCollider with RectCollider collision
   * Thanks to this StackOverflow answer for the math:
   *   https://stackoverflow.com/a/21096179
   *
   * @param {RectCollider} rect
   */
  isCollidingWithRect(rect) {
    const distX = Math.abs(this.x - rect.cx);
    const distY = Math.abs(this.y - rect.cy);

    if (distX > rect.hw + this.radius) {
      return false;
    }

    if (distY > rect.hh + this.radius) {
      return false;
    }

    if (distX <= rect.hw) {
      return false;
    }

    if (distY <= rect.hh) {
      return false;
    }

    const dx = distX - rect.hw;
    const dy = distY - rect.hy;
    return dx * dx + dy * dy <= this.radius2;
  }
}

/* A generic rectangle collider */
class RectCollider {
  /**
   * RectCollider constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.cx = this.x - this.w / 2;
    this.cy = this.y - this.h / 2;
    this.hw = this.w / 2;
    this.hh = this.h / 2;
  }

  /**
   * Checks RectCollider with SphereCollider collision
   * NOTE: delegates to SphereCollider
   *
   * @param {SphereCollider} rect
   */
  isCollidingWithSphere(sphere) {
    return sphere.isCollidingWithRect(this);
  }
}

/* A plinko ball */
class Ball {
  /**
   * Ball constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} mass
   * @param {string} color
   */
  constructor(x, y, radius, mass, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.color = color;

    this.ax = 0.0;
    this.ay = 0.0;

    this.collider = new SphereCollider(this.x, this.y, this.radius);
  }

  /* Updates the physics of the ball */
  update(dt) {
    this.ay = Math.min(this.ay + GRAVITY, 50.0);

    this.x += this.ax * dt;
    this.y += this.ay * dt;

    this.collider.x = this.x;
    this.collider.y = this.y;

    if (this.x > 440 || this.x < 184) {
      this.ax *= -1;
    }

    for (const peg of pegs) {
      if (this.collider.isCollidingWithSphere(peg.collider)) {
        this.#computeCollisionWithBall(peg);

        this.x += this.ax * dt;
        this.y += this.ay * dt;
      }
    }

    for (const hole of holes) {
      if (this.collider.isCollidingWithRect(hole.collider)) {
      }
    }
  }

  /**
   * Draws the ball to the canvas
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Computes the collision between balls
   * Based on:
   *   https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
   *
   * @param {Ball} ball
   */
  #computeCollisionWithBall(ball) {
    const cdiff_x = this.x - ball.x;
    const cdiff_y = this.y - ball.y;

    const vdiff_x = -this.ax;
    const vdiff_y = -this.ay;

    const dot = vdiff_x * cdiff_x + vdiff_y * cdiff_y;
    if (dot > 0) {
      const distance = cdiff_x * cdiff_x + cdiff_y * cdiff_y;
      const scale = dot / distance;

      const xc = cdiff_x * scale;
      const yc = cdiff_y * scale;

      const mass = this.mass + ball.mass;
      const w = (2 * ball.mass) / mass;

      this.ax += w * xc;
      this.ay += w * yc;
    }
  }
}

const pegDist = 16;
const pegCount = 16;
const pegs = [];

for (let dy = 0; dy < 16; ++dy) {
  const y = 32 + 16 * dy;

  let bx = 320 - pegDist * (pegCount / 2);
  if (dy % 2) {
    bx -= pegDist / 2;
  }

  for (let dx = 0; dx < pegCount + (dy % 2); ++dx) {
    const x = bx + pegDist * dx;
    pegs.push(new Ball(x, y, 2, 100, "grey"));
  }
}

/* Holes which tick each number */
const holes = [];

const ball = new Ball(320, 4, 4, 25, "red");
ball.ax += Math.random() * 4 - 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.setInterval(() => {
  ctx.clearRect(0, 0, 600, 600);

  ball.update(0.1667);
  ball.draw(ctx);
  for (const peg of pegs) {
    peg.draw(ctx);
  }
}, 16);
