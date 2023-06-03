import Position from '../types/Position.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';
import SpriteConfig from '../types/SpriteConfig.js';

class Armada {
  canvas: HTMLCanvasElement;
  playerY: number;
  imageCache: ImageCache;
  ctx: CanvasRenderingContext2D;
  ships: { points: number; sprite: Sprite }[];
  perRow: number;
  rows: number;
  stride: number;
  padding: number;
  yShiftAmount: number;
  ticksPerShip: number;
  gameOverCallback: () => void;
  allClearCallback: () => void;
  initalPostions: Position[] = [];
  shipCount: number;
  shiftDown: boolean;
  shiftBack: boolean;
  ticks: number;
  ticksPerMove: number;
  direction: Position;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gameOverCallback: () => void,
    allClearCallback: () => void
  ) {
    this.canvas = canvas;
    this.playerY = 96;
    this.imageCache = imageCache;
    this.ctx = ctx;
    this.ships = [];
    this.perRow = 11;
    this.rows = 5;
    this.stride = 20;
    this.padding = 100;
    this.yShiftAmount = 32;
    this.ticksPerShip = 1;
    this.gameOverCallback = gameOverCallback;
    this.allClearCallback = allClearCallback;
    this.initalPostions = [];
    this.shipCount = this.perRow * this.rows;
    this.shiftDown = false;
    this.shiftBack = false;
    this.ticks = 0;
    this.ticksPerMove = this.ticksPerShip * this.perRow * this.rows;
    this.direction = { x: this.stride, y: 0 };

    this.init();
  }

  _rowImage = (row: number): string => {
    switch (row) {
      case 1:
        return 'alien1';
      case 2:
      case 3:
        return 'alien2';
      default:
        return 'alien3';
    }
  };

  _rowPoints = (row: number): number => {
    switch (row) {
      case 1:
        return 30;
      case 2:
      case 3:
        return 20;
      default:
        return 10;
    }
  };

  init = () => {
    const { ships, imageCache, ctx } = this;
    const built: { points: number; config: SpriteConfig }[] = [];
    const shipWidth = 32;
    const spacing = 64;
    const armadaWidth = (this.perRow + 1) * spacing + shipWidth;
    const xStart = (this.canvas.width - armadaWidth) / 2;
    const yStart = 0;
    const sheetSize = { w: 64, h: shipWidth };
    const frameCount = 2;
    const ticksPerFrame = 60;

    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.perRow; j++) {
        const startPosition = {
          x: xStart + spacing * j,
          y: yStart + spacing * i,
        };
        this.initalPostions.push(startPosition);

        built.push({
          points: this._rowPoints(i),
          config: {
            startPosition: startPosition,
            tag: this._rowImage(i),
            sheetSize,
            frameCount,
            ticksPerFrame,
          },
        });
      }
    }

    built.forEach((ship) => {
      ships.push({
        points: ship.points,
        sprite: new Sprite(imageCache, ctx, ship.config),
      });
    });
  };

  _adjustSpeedPerShipCount = () => {
    this.ticksPerMove = this.shipCount * this.ticksPerShip;
  };

  _checkAllDestroyed = () => {
    if (this.shipCount === 0) {
      this.reset();
      this.allClearCallback();
    }
  };

  _checkBoundaries = () => {
    const { ships, stride, canvas, padding } = this;
    let encroachR = false;
    let encroachL = false;
    let encroachPlayer = false;

    ships.forEach((ship) => {
      if (ship.sprite.isVisible()) {
        if (ship.sprite.position().x < padding) {
          encroachL = true;
        }
        if (ship.sprite.position().x > canvas.width - padding) {
          encroachR = true;
        }
        if (ship.sprite.position().y > canvas.height - this.playerY) {
          encroachPlayer = true;
        }
      }
    });

    if (encroachR) {
      this.shiftDown = true;
      this.direction = { x: stride * -1, y: 0 };
    } else if (encroachL) {
      this.shiftDown = true;
      this.direction = { x: stride, y: 0 };
    } else if (encroachPlayer) {
      this.direction = { x: stride, y: 0 };
      this.reset();
      this.gameOverCallback();
    }
  };

  _move = () => {
    const { ships, yShiftAmount } = this;

    if (this.shiftDown || this.shiftBack) {
      if (this.shiftBack) {
        ships.forEach((ship) => {
          this.shiftBack = false;
          this.shiftDown = false;
          ship.sprite.move({ x: this.direction.x, y: 0 });
        });
      } else {
        ships.forEach((ship) => {
          this.shiftDown = false;
          this.shiftBack = true;
          ship.sprite.move({ x: 0, y: yShiftAmount });
        });
      }
    } else {
      ships.forEach((ship) => {
        ship.sprite.move(this.direction);
      });
    }
  };

  _think = () => {
    this._checkAllDestroyed();
    this._checkBoundaries();
    this._move();
    this._adjustSpeedPerShipCount();
  };

  hideShip = (index: number) => {
    this.shipCount -= 1;
    this.ships[index].sprite.hide();
  };

  canFire = () => {
    const visible = this.ships.filter((ship) => ship.sprite.isVisible());
    const sortedDescPositions = visible
      .sort((a, b) => b.sprite.position().y - a.sprite.position().y)
      .map((ship) => ship.sprite.position());

    return sortedDescPositions.filter(
      (position, index, arr) =>
        index === arr.findIndex((arrItem) => arrItem.x === position.x)
    );
  };

  positions = () => this.ships.map((ship) => ship.sprite.position());

  update = () => {
    this.ticks += 1;

    if (this.ticks > this.ticksPerMove) {
      this.ticks = 0;
      this._think();
    }
  };

  reset = () => {
    this.ships.forEach((ship, i) => {
      ship.sprite.moveTo(this.initalPostions[i]);
      ship.sprite.show();
      this.shipCount = this.perRow * this.rows;
    });
  };

  render = () => {
    this.ships.forEach((ship) => {
      ship.sprite.render();
    });
  };
}

export default Armada;
