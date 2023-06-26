import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';

class Explosion {
  #sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const config: SpriteConfig = {
      loop: false,
      startPosition: { x: canvas.width / 2, y: canvas.height - 256 },
      tag: 'explosion',
      sheetSize: { w: 96, h: 32 },
      frameCount: 3,
      ticksPerFrame: 10,
    };

    this.#sprite = new Sprite(imageCache, ctx, config);
  }

  get sprite() {
    return this.#sprite;
  }

  public render = () => {
    this.#sprite.render();
  };
}

export default Explosion;
