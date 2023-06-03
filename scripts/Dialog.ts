class Dialog {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fontSize: number;
  font: string;
  topMarginPx: number;
  text: string[];

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fontSizePx: number,
    text: string[],
    topMarginPx?: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.fontSize = fontSizePx || 14;
    this.font = `bold ${this.fontSize}px \'Press Start 2P\'`;
    this.topMarginPx = topMarginPx || 0;
    this.text = text;
  }

  render = () => {
    const { canvas, ctx, font, fontSize, topMarginPx } = this;

    this.text.forEach((line: string, index: number) => {
      const xOffset = (line.length / 2) * this.fontSize;
      const yOffset = index * fontSize * 1.5;
      const location = {
        x: canvas.width / 2 - xOffset,
        y: canvas.height / 2 + yOffset + topMarginPx,
      };

      ctx.font = font;
      ctx.fillStyle = 'white';
      ctx.fillText(line, location.x, location.y);
    });
  };
}

export default Dialog;
