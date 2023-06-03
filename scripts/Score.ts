import Position from '../types/Position.js';

class Score {
  ctx: CanvasRenderingContext2D;
  location: Position;
  font: string;
  score: 0;
  text: 'SCORE:';

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.location = { x: 32, y: 56 };
    this.font = "bold 24px 'Press Start 2P'";
    this.score = 0;
    this.text = 'SCORE:';
  }

  update = (amount: number) => {
    this.score += amount;
  };

  reset = () => {
    this.score = 0;
  };

  render = () => {
    const { ctx, font, location } = this;
    ctx.font = font;
    ctx.fillStyle = 'white';
    ctx.fillText(`${this.text} ${this.score}`, location.x, location.y);
  };
}

export default Score;
