import Position from '../types/Position.js';

class Score {
  static #location: Position = { x: 32, y: 56 };
  static #font = "bold 24px 'Press Start 2P'";
  static #text = 'SCORE:';
  #ctx: CanvasRenderingContext2D;
  #score = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.#ctx = ctx;
  }

  public update = (amount: number) => {
    this.#score += amount;
  };

  public reset = () => {
    this.#score = 0;
  };

  public render = () => {
    this.#ctx.font = Score.#font;
    this.#ctx.fillStyle = 'white';
    this.#ctx.fillText(
      `${Score.#text} ${this.#score}`,
      Score.#location.x,
      Score.#location.y
    );
  };
}

export default Score;
