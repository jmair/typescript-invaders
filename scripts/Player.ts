import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';
import { Actions } from './Input.js';
import SpriteConfig from '../types/SpriteConfig.js';

class Player {
  static #speed = 4;
  static #padding = 100;
  static #spriteOptions = {
    sheetSize: { w: 64, h: 24 },
    frameCount: 1,
    ticksPerFrame: 5,
    tag: 'hero',
  };

  #canvas: HTMLCanvasElement;
  #options: SpriteConfig;
  #sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.#canvas = canvas;
    this.#options = {
      ...Player.#spriteOptions,
      startPosition: { x: canvas.width / 2 - 16, y: canvas.height - 200 },
    };

    this.#sprite = new Sprite(imageCache, ctx, this.#options);
  }

  get position() {
    return this.#sprite.position;
  }

  get width() {
    return this.#options.sheetSize.w;
  }

  get height() {
    return this.#options.sheetSize.h;
  }

  get sprite() {
    return this.#sprite;
  }

  public update = (playerInput: Actions) => {
    this.#sprite.move(this.#getVector(playerInput));
  };

  public render = () => {
    this.#sprite.render();
  };

  #checkBounds = () => {
    const currXPos = this.#sprite.position.x;
    return {
      left: currXPos > Player.#padding,
      right: currXPos < this.#canvas.width - Player.#padding,
    };
  };

  #getVector = (input: Actions) => {
    const bounds = this.#checkBounds();
    let vector = { x: 0, y: 0 };

    if (input.RIGHT) {
      if (bounds.right) {
        vector.x = Player.#speed;
      }
    } else if (input.LEFT) {
      if (bounds.left) {
        vector.x = Player.#speed * -1;
      }
    }
    return vector;
  };
}

export default Player;
