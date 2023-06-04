import Position from '../types/Position.js';
import SheetSize from '../types/SheetSize.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';
import { Actions } from './Input.js';

class Player {
  canvas: HTMLCanvasElement;
  options: {
    startPosition: Position;
    tag: string;
    sheetSize: SheetSize;
    frameCount: number;
    ticksPerFrame: number;
  };
  speed: number;
  padding: number;
  sprite: Sprite;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.options = {
      startPosition: { x: canvas.width / 2 - 16, y: canvas.height - 200 },
      tag: 'hero',
      sheetSize: { w: 64, h: 24 },
      frameCount: 1,
      ticksPerFrame: 5,
    };
    this.speed = 4;
    this.padding = 100;
    this.sprite = new Sprite(imageCache, ctx, this.options);
  }

  _checkBounds = () => {
    const currXPos = this.sprite.position().x;
    return {
      left: currXPos > this.padding,
      right: currXPos < this.canvas.width - this.padding,
    };
  };

  _getVector = (input: Actions) => {
    const bounds = this._checkBounds();
    let vector = { x: 0, y: 0 };

    if (input.RIGHT) {
      if (bounds.right) {
        vector.x = this.speed;
      }
    } else if (input.LEFT) {
      if (bounds.left) {
        vector.x = this.speed * -1;
      }
    }
    return vector;
  };

  position = () => this.sprite.position();

  width = () => this.options.sheetSize.w;
  height = () => this.options.sheetSize.h;

  update = (playerInput: Actions) => {
    this.sprite.move(this._getVector(playerInput));
  };

  render = () => {
    this.sprite.render();
  };
}

export default Player;
