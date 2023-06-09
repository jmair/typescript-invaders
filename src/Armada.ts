import Position from '../types/Position.js';
import ImageCache from './ImageCache.js';
import Sprite from './Sprite.js';
import SpriteConfig from '../types/SpriteConfig.js';
import Ship from '../types/Ship.js';

interface PositionedShip {
  points: number;
  config: SpriteConfig;
}
export default class Armada {
  static #playerY = 96;
  static #perRow = 11;
  static #rows = 5;
  static #stride = 20;
  static #padding = 100;
  static #yShiftAmount = 32;
  static #ticksPerShip = 2;
  #ships: Ship[] = [];
  #initalPostions: Position[] = [];
  #shipCount: number;
  #shiftDown = false;
  #shiftBack = false;
  #ticks = 0;
  #ticksPerMove: number;
  #direction: Position;
  #imageCache: ImageCache;
  #ctx: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #gameOverCallback: () => void;
  #allClearCallback: () => void;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gameOverCallback: () => void,
    allClearCallback: () => void
  ) {
    this.#imageCache = imageCache;
    this.#ctx = ctx;
    this.#canvas = canvas;
    this.#gameOverCallback = gameOverCallback;
    this.#allClearCallback = allClearCallback;
    this.#shipCount = Armada.#perRow * Armada.#rows;
    this.#ticksPerMove = Armada.#ticksPerShip * Armada.#perRow * Armada.#rows;
    this.#direction = { x: Armada.#stride, y: 0 };

    this.init();
  }

  get ships(): Ship[] {
    return this.#ships;
  }

  get canFire(): Position[] {
    const visible = this.#ships.filter((ship) => ship.sprite.isVisible());
    const sortedDescPositions = visible
      .sort((a, b) => b.sprite.position.y - a.sprite.position.y)
      .map((ship) => ship.sprite.position);

    return sortedDescPositions.filter(
      (position, index, arr) =>
        index === arr.findIndex((arrItem) => arrItem.x === position.x)
    );
  }

  get positions(): Position[] {
    return this.#ships.map((ship) => ship.sprite.position);
  }

  public init = () => {
    const positionedShips = this.#setInitialPositions();

    positionedShips.forEach((ship) => {
      this.#ships.push({
        points: ship.points,
        sprite: new Sprite(this.#imageCache, this.#ctx, ship.config),
      });
    });
  };

  public hideShip = (index: number) => {
    this.#shipCount -= 1;
    this.#ships[index].sprite.hide();
  };

  public update = () => {
    this.#ticks += 1;

    if (this.#ticks > this.#ticksPerMove) {
      this.#ticks = 0;
      this.#think();
    }
  };

  public reset = () => {
    this.#ships.forEach((ship, i) => {
      ship.sprite.moveTo(this.#initalPostions[i]);
      ship.sprite.show();
      this.#shipCount = Armada.#perRow * Armada.#rows;
    });
  };

  public render = () => {
    this.#ships.forEach((ship) => {
      ship.sprite.render();
    });
  };

  #rowImage = (row: number): string => {
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

  #rowPoints = (row: number): number => {
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

  #setInitialPositions = () => {
    const shipWidth = 32;
    const spacing = 64;
    const armadaWidth = (Armada.#perRow + 1) * spacing + shipWidth;
    const xStart = (this.#canvas.width - armadaWidth) / 2;
    const yStart = 0;
    const sheetSize = { w: 64, h: shipWidth };
    const frameCount = 2;
    const ticksPerFrame = 60;

    const positionedShips: PositionedShip[] = [];

    for (let i = 1; i <= Armada.#rows; i++) {
      for (let j = 1; j <= Armada.#perRow; j++) {
        const startPosition = {
          x: xStart + spacing * j,
          y: yStart + spacing * i,
        };
        this.#initalPostions.push(startPosition);

        positionedShips.push({
          points: this.#rowPoints(i),
          config: {
            startPosition: startPosition,
            tag: this.#rowImage(i),
            sheetSize,
            frameCount,
            ticksPerFrame,
          },
        });
      }
    }

    return positionedShips;
  };

  #adjustSpeedPerShipCount = () => {
    this.#ticksPerMove = this.#shipCount * Armada.#ticksPerShip;
  };

  #checkAllDestroyed = () => {
    if (this.#shipCount === 0) {
      this.reset();
      this.#allClearCallback();
    }
  };

  #checkBoundaries = () => {
    let encroachR = false;
    let encroachL = false;
    let encroachPlayer = false;

    this.#ships.forEach((ship) => {
      if (ship.sprite.isVisible()) {
        if (ship.sprite.position.x < Armada.#padding) {
          encroachL = true;
        }
        if (ship.sprite.position.x > this.#canvas.width - Armada.#padding) {
          encroachR = true;
        }
        if (ship.sprite.position.y > this.#canvas.height - Armada.#playerY) {
          encroachPlayer = true;
        }
      }
    });

    if (encroachR) {
      this.#shiftDown = true;
      this.#direction = { x: Armada.#stride * -1, y: 0 };
    } else if (encroachL) {
      this.#shiftDown = true;
      this.#direction = { x: Armada.#stride, y: 0 };
    } else if (encroachPlayer) {
      this.#direction = { x: Armada.#stride, y: 0 };
      this.reset();
      this.#gameOverCallback();
    }
  };

  #move = () => {
    if (this.#shiftDown || this.#shiftBack) {
      if (this.#shiftBack) {
        this.#ships.forEach((ship) => {
          this.#shiftBack = false;
          this.#shiftDown = false;
          ship.sprite.move({ x: this.#direction.x, y: 0 });
        });
      } else {
        this.#ships.forEach((ship) => {
          this.#shiftDown = false;
          this.#shiftBack = true;
          ship.sprite.move({ x: 0, y: Armada.#yShiftAmount });
        });
      }
    } else {
      this.#ships.forEach((ship) => {
        ship.sprite.move(this.#direction);
      });
    }
  };

  #think = () => {
    this.#checkAllDestroyed();
    this.#checkBoundaries();
    this.#move();
    this.#adjustSpeedPerShipCount();
  };
}
