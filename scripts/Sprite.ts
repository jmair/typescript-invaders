import Position from '../types/Position.js';
import SheetSize from '../types/SheetSize.js';
import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';

class Sprite {
  imageCache: ImageCache;
  ctx: CanvasRenderingContext2D;
  tag: string;
  startPos: Position;
  sheetSize: SheetSize;
  loop: boolean;
  frameCount: number;
  ticksPerFrame: number;
  playSingle: boolean;
  pos: Position;
  frameIndex: number;
  index: number;
  ticks: number;
  visible: boolean;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    config: SpriteConfig
  ) {
    this.imageCache = imageCache;
    this.ctx = ctx;
    this.tag = config.tag;
    this.startPos = config.startPosition || { x: 0, y: 0 };
    this.sheetSize = config.sheetSize;
    this.loop = config.loop === undefined ? true : config.loop;
    this.frameCount = config.frameCount || 1;
    this.ticksPerFrame = config.ticksPerFrame;
    this.playSingle = false;
    this.pos = this.startPos;
    this.frameIndex = 0;
    this.index = 0;
    this.ticks = 0;
    this.visible = this.loop;
  }

  play = () => {
    this.visible = true;
    this.playSingle = true;
  };
  hide = () => (this.visible = false);
  show = () => (this.visible = true);

  isVisible = () => this.visible;

  position = () => this.pos;

  move = (amount: Position) => {
    this.pos = {
      x: this.pos.x + amount.x,
      y: this.pos.y + amount.y,
    };
  };

  moveTo = (position: Position) => (this.pos = position);

  _updateFrame = () => {
    const { ticksPerFrame, frameCount } = this;
    this.ticks += 1;

    if (this.ticks > ticksPerFrame) {
      this.ticks = 0;
      if (this.loop) {
        this.frameIndex < frameCount - 1
          ? (this.frameIndex += 1)
          : (this.frameIndex = 0);
      } else if (this.playSingle) {
        if (this.frameIndex < frameCount - 1) {
          this.frameIndex += 1;
        } else {
          this.frameIndex = 0;
          this.playSingle = false;
          this.hide();
        }
      }
    }
  };

  _draw = () => {
    const {
      frameCount,
      tag,
      sheetSize: { w, h },
    } = this;
    this.ctx.drawImage(
      this.imageCache.get(tag),
      this.frameIndex * (w / frameCount),
      0,
      w / frameCount,
      h,
      this.pos.x,
      this.pos.y,
      w / frameCount,
      h
    );
  };

  render = () => {
    this._updateFrame();
    if (this.visible) {
      this._draw();
    }
  };
}

export default Sprite;
