class Dialog {
  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #fontSize: number;
  #fontCss: string;
  #topMarginPx: number;
  #text: string[];

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fontSizePx: number,
    text: string[],
    topMarginPx?: number
  ) {
    const fontSize = fontSizePx || 14;

    this.#canvas = canvas;
    this.#ctx = ctx;
    this.#fontSize = fontSize;
    this.#fontCss = `bold ${fontSize}px \'Press Start 2P\'`;
    this.#topMarginPx = topMarginPx || 0;
    this.#text = text;
  }

  public render = () => {
    this.#text.forEach((line: string, index: number) => {
      const xOffset = (line.length / 2) * this.#fontSize;
      const yOffset = index * this.#fontSize * 1.5;
      const location = {
        x: this.#canvas.width / 2 - xOffset,
        y: this.#canvas.height / 2 + yOffset + this.#topMarginPx,
      };

      this.#ctx.font = this.#fontCss;
      this.#ctx.fillStyle = 'white';
      this.#ctx.fillText(line, location.x, location.y);
    });
  };
}

export default Dialog;
