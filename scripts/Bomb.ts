import Sprite from './Sprite.js';
import Position from '../types/Position.js';
import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';

class Bomb {
  speed: number;
  direction: Position;
  options: SpriteConfig;
  sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    location: Position
  ) {
    this.speed = 1.5;
    this.direction = { x: 0, y: this.speed };
    this.options = {
      startPosition: location,
      tag: 'bomb',
      sheetSize: { w: 12, h: 32 },
      frameCount: 3,
      ticksPerFrame: 10,
    };
    this.sprite = new Sprite(imageCache, ctx, this.options);
  }

  update = () => {
    this.sprite.move(this.direction);
  };

  render = () => {
    this.sprite.render();
  };
}

export default Bomb;
