/* Plinko
 * Colliders implementation
 */

"use strict";

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
   *   https://stackoverflow.com/a/35849250
   *
   * @param {RectCollider} rect
   */
  isCollidingWithRect(rect) {
    const distX = Math.abs(this.x - rect.x - rect.hw);
    const distY = Math.abs(this.y - rect.y - rect.hh);

    const rw = rect.hw + this.radius;
    if (distX > rw) {
      return false;
    }

    const rh = rect.hh + this.radius;
    if (distY > rh) {
      return false;
    }

    if (distX <= rect.hw) {
      return true;
    }

    if (distY <= rect.hh) {
      return true;
    }

    const dw = distX - rect.hw;
    const dh = distY - rect.hh;

    const hypot = dw * dw + dh * dh;
    return hypot <= this.radius2;
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
