import Sprite from './Sprite.js';
import Outpost from './Outpost.js';
import Explosion from './Explosion.js';
import Score from './Score.js';
import SpriteConfig from '../types/SpriteConfig.js';
import ImageCache from './ImageCache.js';
import Position from '../types/Position.js';
import Armada from './Armada.js';
import Base from './Base.js';

export default class Laser {
  static #velocity = { x: 0, y: -20 };
  #outpost: Outpost;
  #sprite: Sprite;
  #moving: boolean;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    outpost: Outpost
  ) {
    this.#outpost = outpost;
    const config: SpriteConfig = {
      startPosition: { x: -100, y: -100 },
      tag: 'laser',
      sheetSize: { w: 12, h: 24 },
      frameCount: 4,
      ticksPerFrame: 180,
    };

    this.#sprite = new Sprite(imageCache, ctx, config);
    this.#moving = false;
  }

  public fire = () => {
    this.#sprite.show();
    this.#moving = true;
  };

  public moveTo = (position: Position) => {
    this.#sprite.moveTo(position);
  };

  public update = (
    playersCannon: Position,
    armada: Armada,
    explosion: Explosion,
    score: Score
  ) => {
    this.#checkArmadaCollision(armada, explosion, score);
    this.#checkIfOffScreen();
    this.#moveOrResetToPlayer(playersCannon);
    this.#checkForBaseCollision();
  };

  public render = () => {
    this.#sprite.render();
  };

  #moveOrResetToPlayer = (playersCannon: Position) => {
    if (this.#moving) {
      this.#sprite.move(Laser.#velocity);
    } else {
      // if it's not moving reset it to the player's position
      this.#sprite.hide();
      this.moveTo(playersCannon);
    }
  };

  #checkIfOffScreen = () => {
    if (this.#sprite.position.y < 0) {
      this.#moving = false;
    }
  };

  #checkArmadaCollision = (
    armada: Armada,
    explosion: Explosion,
    score: Score
  ) => {
    const laser = this.#sprite.position;
    const shipSquare = 32;

    armada.positions.forEach((position, index) => {
      const xDiff = laser.x - position.x;
      const yDiff = laser.y - position.y;
      const xAlign = xDiff > 0 && xDiff < shipSquare;
      const yAlign = yDiff > 0 && yDiff < shipSquare;

      if (xAlign && yAlign) {
        if (armada.ships[index].sprite.isVisible()) {
          // do not collide with hidden ships
          score.update(armada.ships[index].points);
          this.#moving = false;
          armada.hideShip(index);
          explosion.sprite.moveTo(position);
          explosion.sprite.play();
        }
      }
    });
  };

  #checkForBaseCollision = () => {
    let collision = false;
    this.#outpost.bases.forEach((base: Base, i: number) => {
      base.blockLists.forEach((list, j) => {
        list.forEach((block, k) => {
          const laserPosition = this.#sprite.position;
          const xDiff = Math.abs(block.x - laserPosition.x);
          const yDiff = block.y - laserPosition.y;
          const xAlign = xDiff < 5;
          const yAlign = yDiff > 0 && yDiff < 32;
          if (xAlign && yAlign) {
            this.#outpost.removeBlock(i, j, k);
            collision = true;
          }
        });
      });
    });
    return collision;
  };
}
