import Sprite from './Sprite.js';
import Position from '../types/Position.js';
import ImageCache from './ImageCache.js';
import SpriteConfig from '../types/SpriteConfig.js';

class Bomb {
  #speed = 1.5;
  #direction: Position;
  #sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    startPosition: Position
  ) {
    this.#direction = { x: 0, y: this.#speed };

    const options: SpriteConfig = {
      startPosition,
      tag: 'bomb',
      sheetSize: { w: 12, h: 32 },
      frameCount: 3,
      ticksPerFrame: 10,
    };

    this.#sprite = new Sprite(imageCache, ctx, options);
  }

  get sprite() {
    return this.#sprite;
  }

  update = () => {
    this.#sprite.move(this.#direction);
  };

  render = () => {
    this.#sprite.render();
  };
}

export default Bomb;
