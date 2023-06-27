import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';

export default class PlayerLives {
  static #maxLives = 10;
  static #bottomMarginPx = 64;
  static #spriteConfig: SpriteConfig = {
    tag: 'hero',
    sheetSize: { w: 64, h: 24 },
    frameCount: 1,
    ticksPerFrame: 1,
    startPosition: { x: 0, y: 0 },
  };
  #sprites: Sprite[] = [];

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    for (let i = 1; i < PlayerLives.#maxLives + 1; i++) {
      const sheetWidth = PlayerLives.#spriteConfig.sheetSize.w;
      const spacer = 8;
      const instanceX = (sheetWidth + spacer) * i;

      const config = Object.assign({}, PlayerLives.#spriteConfig, {
        startPosition: {
          x: instanceX,
          y: canvas.height - PlayerLives.#bottomMarginPx,
        },
      });

      this.#sprites.push(new Sprite(imageCache, ctx, config));
    }
  }

  public render = (lives: number) => {
    const toRender =
      lives < PlayerLives.#maxLives ? lives : PlayerLives.#maxLives;
    for (let i = 1; i < toRender; i++) {
      this.#sprites[i].render();
    }
  };
}
