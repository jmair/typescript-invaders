import Position from '../types/Position.js';
import SheetSize from '../types/SheetSize.js';
import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';

export default class Sprite {
  #imageCache: ImageCache;
  #ctx: CanvasRenderingContext2D;
  #tag: string;
  #sheetSize: SheetSize;
  #loop: boolean;
  #frameCount: number;
  #ticksPerFrame: number;
  #playSingle: boolean;
  #pos: Position;
  #frameIndex: number;
  #ticks = 0;
  #visible: boolean;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    config: SpriteConfig
  ) {
    this.#imageCache = imageCache;
    this.#ctx = ctx;
    this.#tag = config.tag;
    this.#sheetSize = config.sheetSize;
    this.#loop = config.loop === undefined ? true : config.loop;
    this.#frameCount = config.frameCount || 1;
    this.#ticksPerFrame = config.ticksPerFrame;
    this.#playSingle = false;
    this.#pos = config.startPosition || { x: 0, y: 0 };
    this.#visible = this.#loop;
  }

  public play = () => {
    this.#visible = true;
    this.#playSingle = true;
  };

  public hide = () => (this.#visible = false);
  public show = () => (this.#visible = true);

  public isVisible = () => this.#visible;

  get position() {
    return this.#pos;
  }

  public move = (amount: Position) => {
    this.#pos = {
      x: this.#pos.x + amount.x,
      y: this.#pos.y + amount.y,
    };
  };

  public moveTo = (position: Position) => (this.#pos = position);

  public render = () => {
    this.#updateFrame();
    if (this.#visible) {
      this.#draw();
    }
  };

  #updateFrame = () => {
    this.#ticks += 1;

    if (this.#ticks > this.#ticksPerFrame) {
      this.#ticks = 0;
      if (this.#loop) {
        this.#frameIndex < this.#frameCount - 1
          ? (this.#frameIndex += 1)
          : (this.#frameIndex = 0);
      } else if (this.#playSingle) {
        if (this.#frameIndex < this.#frameCount - 1) {
          this.#frameIndex += 1;
        } else {
          this.#frameIndex = 0;
          this.#playSingle = false;
          this.hide();
        }
      }
    }
  };

  #draw = () => {
    this.#ctx.drawImage(
      this.#imageCache.get(this.#tag),
      this.#frameIndex * (this.#sheetSize.w / this.#frameCount),
      0,
      this.#sheetSize.w / this.#frameCount,
      this.#sheetSize.h,
      this.#pos.x,
      this.#pos.y,
      this.#sheetSize.w / this.#frameCount,
      this.#sheetSize.h
    );
  };
}
