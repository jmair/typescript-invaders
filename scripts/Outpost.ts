import Base from './Base.js';

class Outpost {
  canvas: HTMLCanvasElement;
  baseLocations: number[];
  bases: Base[];

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.baseLocations = [250, 550, 850];
    this.bases = [];

    this.baseLocations.forEach((baseX) => {
      const baseY = this.canvas.height - 300;
      this.bases.push(
        new Base(ctx, {
          topLeft: { x: baseX, y: baseY },
          width: 20,
          height: 10,
          color: '#777777',
          blockSize: 4,
        })
      );
    });
  }

  removeBlock = (i: number, j: number, k: number) => {
    this.bases[i].removeBlock(j, k);
  };

  // bases = () => this.bases;

  reset = () => this.bases.forEach((base) => base.init());

  render = () => {
    this.bases.forEach((base) => base.render());
  };
}

export default Outpost;
