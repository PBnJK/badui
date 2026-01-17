/* Plinko
 * Ball implementation (both the Plinko ball and the pegs)
 */

"use strict";

const GRAVITY = 0.5;

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

  /* Adds a random bias to the X velocity */
  addRandomBias() {
    this.ax = Math.random() * 8 - 4;
  }

  /**
   * Updates the physics of the ball
   *
   * @param {number} dt
   */
  update(dt) {
    this.ay = Math.min(this.ay + GRAVITY, 50.0);

    this.x += this.ax * dt;
    this.y += this.ay * dt;

    this.collider.x = this.x;
    this.collider.y = this.y;

    /* Collide with walls */
    if (this.x > 448 || this.x < 192) {
      this.ax *= -0.9;
    }

    for (const peg of pegs) {
      if (this.collider.isCollidingWithSphere(peg.collider)) {
        this.#computeCollisionWithBall(peg);

        this.x += this.ax * dt;
        this.y += this.ay * dt;

        this.collider.x = this.x;
        this.collider.y = this.y;
      }
    }

    for (const hole of holes) {
      if (this.collider.isCollidingWithRect(hole.collider)) {
        hole.callback();
        this.#reset();
        break;
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

  /* Resets the ball to its starting position */
  #reset() {
    this.x = 320;
    this.y = 4;
    this.ay = 0.0;
    this.addRandomBias();
  }
}
