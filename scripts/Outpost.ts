import Base from './Base.js';

class Outpost {
  #bases: Base[] = [];
  static #baseLocations = [250, 550, 850];
  static #baseVerticalOffset = 300;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    Outpost.#baseLocations.forEach((baseX) => {
      const baseY = canvas.height - Outpost.#baseVerticalOffset;

      this.#bases.push(
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

  get bases() {
    return this.#bases;
  }

  public removeBlock = (i: number, j: number, k: number) => {
    this.#bases[i].removeBlock(j, k);
  };

  public reset = () => this.#bases.forEach((base) => base.init());

  public render = () => {
    this.#bases.forEach((base) => base.render());
  };
}

export default Outpost;
