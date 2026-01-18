/* Plinko
 * Ball implementation (both the Plinko ball and the pegs)
 */

"use strict";

const GRAVITY = 0.5;

/* A plinko ball */
class Ball {
  #isFalling = false;

  #heldAngle = -0.02;
  #heldAngleCos = Math.cos(this.#heldAngle);
  #heldAngleSin = Math.sin(this.#heldAngle);

  /**
   * Ball constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} mass
   * @param {string} color
   * @param {string} vectorColor
   */
  constructor(x, y, radius, mass, color, vectorColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;

    this.color = color;
    this.vectorColor = vectorColor;

    this.ax = 0.0;
    this.ay = 8.0;

    this.collider = new SphereCollider(this.x, this.y, this.radius);
  }

  /**
   * Drops the ball
   */
  release() {
    this.#isFalling = true;
  }

  /**
   * Updates the ball
   *
   * @param {number} dt
   */
  update(dt) {
    if (this.#isFalling) {
      this.#updatePhysics(dt);
    } else {
      this.#updateHeld();
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
   * Draws the ball direction vector to the canvas
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawVector(ctx) {
    if (!this.#isFalling) {
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = this.vectorColor;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.ax * 2.0, this.y + this.ay * 2.0);
      ctx.stroke();
      ctx.lineWidth = 1.0;
    }
  }

  /**
   * Updates the ball as it is held
   */
  #updateHeld() {
    if (this.ay <= 0.0) {
      this.#heldAngle *= -1;
      this.#heldAngleCos = Math.cos(this.#heldAngle);
      this.#heldAngleSin = Math.sin(this.#heldAngle);
    }

    this.ax = this.ax * this.#heldAngleCos + this.ay * this.#heldAngleSin;
    this.ay = this.ay * this.#heldAngleCos - this.ax * this.#heldAngleSin;
  }

  /**
   * Updates the physics of the ball
   *
   * @param {number} dt
   */
  #updatePhysics(dt) {
    this.ay = Math.min(this.ay + GRAVITY, 50.0);

    this.x += this.ax * dt;
    this.y += this.ay * dt;

    this.collider.x = this.x;
    this.collider.y = this.y;

    /* Collide with walls */
    if (this.x > 446 || this.x < 194) {
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

  /**
   * Resets the ball to its starting position
   */
  #reset() {
    this.x = 320;
    this.y = 8;
    this.ax = 0.0;
    this.ay = 8.0;

    this.#isFalling = false;
  }
}
