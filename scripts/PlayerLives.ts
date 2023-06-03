import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';

class PlayerLives {
  imageCache: ImageCache;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  config: SpriteConfig;
  maxLives: number;
  sprites: Sprite[];
  bottomMarginPx: number;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.imageCache = imageCache;
    this.ctx = ctx;
    this.canvas = canvas;
    this.config = {
      tag: 'hero',
      sheetSize: { w: 64, h: 24 },
      frameCount: 1,
      ticksPerFrame: 1,
      startPosition: { x: 0, y: 0 },
    };
    this.maxLives = 10;
    this.sprites = [];
    this.bottomMarginPx = 64;

    for (let i = 1; i < this.maxLives + 1; i++) {
      const sheetWidth = this.config.sheetSize.w;
      const spacer = 8;
      const instanceX = (sheetWidth + spacer) * i;

      const config = Object.assign({}, this.config, {
        startPosition: {
          x: instanceX,
          y: this.canvas.height - this.bottomMarginPx,
        },
      });

      this.sprites.push(new Sprite(this.imageCache, this.ctx, config));
    }
  }

  render = (lives: number) => {
    const toRender = lives < this.maxLives ? lives : this.maxLives;
    for (let i = 1; i < toRender; i++) {
      this.sprites[i].render();
    }
  };
}

export default PlayerLives;
