/* Plinko
 * Goal hole implementation
 */

"use strict";

/* A plinko hole */
class Hole {
  /**
   * Hole constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} text
   * @param {string} textColor
   * @param {string} bgColor
   * @param {function} callback
   */
  constructor(x, y, w, h, text, textColor, bgColor, callback) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.text = text;
    this.textColor = textColor;
    this.bgColor = bgColor;

    this.callback = callback;

    this.collider = new RectCollider(this.x, this.y, this.w, this.h);
  }

  /**
   * Draws the hole to the canvas
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = this.bgColor;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();

    ctx.fillStyle = this.textColor;
    const textSize = ctx.measureText(this.text);
    ctx.fillText(
      this.text,
      this.x + this.w / 2 - textSize.width / 2,
      this.y + this.h / 2 - textSize.ideographicBaseline / 2,
    );
  }
}
