import Armada from './Armada.js';
import Bomb from './Bomb.js';
import ImageCache from './ImageCache.js';
import Outpost from './Outpost.js';
import Player from './Player.js';

class Bombardment {
  imageCache: ImageCache;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  armada: Armada;
  player: Player;
  xOffset: number;
  yOffset: number;
  outpost: Outpost;
  ticks: number;
  tickPerLaunch: number;
  bombs: Bomb[];
  killPlayer: () => void;

  constructor(
    imageCache: ImageCache,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    armada: Armada,
    player: Player,
    killPlayer: () => void,
    outpost: Outpost
  ) {
    this.imageCache = imageCache;
    this.ctx = ctx;
    this.canvas = canvas;
    this.armada = armada;
    this.player = player;
    this.xOffset = 14;
    this.yOffset = 32;
    this.outpost = outpost;
    this.ticks = 0;
    this.tickPerLaunch = 40;
    this.bombs = [];

    this.killPlayer = killPlayer;
  }

  checkPlayerCollision = (bomb: Bomb) => {
    const { player } = this;
    const xDiff = bomb.sprite.position().x - player.sprite.position().x;
    const yDiff = player.sprite.position().y - bomb.sprite.position().y;
    const xAlign = xDiff > 0 && xDiff < this.player.width();
    const yAlign = yDiff > 0 && yDiff < this.player.height();

    if (xAlign && yAlign) {
      this.killPlayer();
    }

    return xAlign && yAlign;
  };

  checkBaseCollision = (bomb: Bomb) => {
    let collision = false;
    this.outpost.bases.forEach((base, i) => {
      base.blockLists.forEach((list, j) => {
        list.forEach((block, k) => {
          const bombPosition = bomb.sprite.position();
          const xDiff = Math.abs(block.x - bombPosition.x);
          const yDiff = block.y - bombPosition.y;
          const xAlign = xDiff < 5;
          const yAlign = yDiff > 0 && yDiff < 32;
          if (xAlign && yAlign) {
            this.outpost.removeBlock(i, j, k);
            collision = true;
          }
        });
      });
    });
    return collision;
  };

  update = () => {
    this.ticks += 1;
    if (this.ticks >= this.tickPerLaunch) {
      this.ticks = 0;
      const canFire = this.armada.canFire();

      if (this.bombs.length < canFire.length) {
        const range = canFire.length;
        const random = Math.floor(range * Math.random());
        const position = {
          x: canFire[random].x + this.xOffset,
          y: canFire[random].y + this.yOffset,
        };

        this.bombs.push(new Bomb(this.imageCache, this.ctx, position));
      }
    }
    // remove bombs that fall off screen
    this.bombs = this.bombs.filter((bomb) => {
      bomb.update();
      const baseCollision = this.checkPlayerCollision(bomb);
      const playerCollision = this.checkBaseCollision(bomb);
      const collision = playerCollision || baseCollision;

      this.checkBaseCollision(bomb);
      return bomb.sprite.position().y < this.canvas.height && !collision;
    });
  };

  reset = () => (this.bombs = []);

  render = () => {
    this.bombs.forEach((bomb) => bomb.render());
  };
}

export default Bombardment;
