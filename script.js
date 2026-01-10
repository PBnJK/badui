/* Main Plinko Script */

const GRAVITY = 9.81;

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
    const distance = Math.sqrt(
      (sphere.x - this.x) ** 2 + (sphere.y - this.y) ** 2,
    );

    return distance <= this.radius + sphere.radius;
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
   * @param {string} color
   */
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.ax = 0.0;
    this.ay = 0.0;
  }

  /* Updates the physics of the ball */
  update(dt) {
    this.ay += GRAVITY * dt;
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
}

/* A plinko peg */
