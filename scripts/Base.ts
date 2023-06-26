import BaseConfig from '../types/BaseConfig.js';
import Position from '../types/Position.js';

class Base {
  #ctx: CanvasRenderingContext2D;
  #blockSize: number;
  #topLeft: Position;
  #color: string;
  #width: number;
  #height: number;
  #blockLists: Position[][];

  constructor(ctx: CanvasRenderingContext2D, options: BaseConfig) {
    this.#ctx = ctx;
    this.#blockSize = options.blockSize;
    this.#topLeft = options.topLeft;
    this.#color = options.color;
    this.#width = options.width;
    this.#height = options.height;
    this.#blockLists = [];

    this.init();
  }

  get blockLists() {
    return this.#blockLists;
  }

  public init = (): void => {
    const lists: Position[][] = [];
    for (let i = 0; i < this.#height; i++) {
      const arr: Position[] = [];
      for (let j = 0; j < this.#width; j++) {
        arr.push({
          x: this.#topLeft.x + j * this.#blockSize,
          y: this.#topLeft.y + i * this.#blockSize,
        });
      }
      lists.push(arr);
    }
    this.#blockLists = lists;
  };

  public removeBlock = (j: number, k: number) => {
    this.#blockLists[j].splice(k, 4);
    if (j + 1 < this.#blockLists.length) this.#blockLists[j + 1].splice(k, 4);
    if (j + 2 < this.#blockLists.length) this.#blockLists[j + 2].splice(k, 4);
  };

  public render = () => {
    this.#ctx.fillStyle = this.#color;

    this.#blockLists.forEach((list, i) => {
      list.forEach((block, j) => {
        this.#ctx.fillRect(block.x, block.y, this.#blockSize, this.#blockSize);
      });
    });
  };
}

export default Base;
