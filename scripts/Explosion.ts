import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';

class Explosion {
  config: SpriteConfig;
  _sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.config = {
      loop: false,
      startPosition: { x: canvas.width / 2, y: canvas.height - 256 },
      tag: 'explosion',
      sheetSize: { w: 96, h: 32 },
      frameCount: 3,
      ticksPerFrame: 10,
    };
    this._sprite = new Sprite(imageCache, ctx, this.config);
  }

  sprite = () => this._sprite;

  render = () => {
    this._sprite.render();
  };
}

export default Explosion;
