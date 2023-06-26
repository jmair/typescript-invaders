import ImageCache from './ImageCache.js';
import Input, { Actions, defaultActions } from './Input.js';
import Player from './Player.js';
import Armada from './Armada.js';
import Laser from './Laser.js';
import Explosion from './Explosion.js';
import Score from './Score.js';
import Dialog from './Dialog.js';
import Bombardment from './Bombardment.js';
import PlayerLives from './PlayerLives.js';
import Outpost from './Outpost.js';

class Game {
  #playerDead = false;
  #gameStarted = false;
  #gameOver = false;
  #playerDeadTicks = 0;
  #maxDeadTicks = 100;
  #initialPlayerLives = 3;
  #startText = 'Press [SPACE] to start a game.';
  #gameOverText = 'Game Over!';
  #tryAgainText = 'Press [SPACE] to try again.';
  #ctx: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #imageCache: ImageCache;
  #width: number;
  #height: number;
  #backgroundColor: string;
  #player: Player;
  #armada: Armada;
  #laser: Laser;
  #explosion: Explosion;
  #outpost: Outpost;
  #bombardment: Bombardment;
  #score: Score;
  #playerLives: PlayerLives;
  #tryAgainDialog: Dialog;
  #startDialog: Dialog;
  #gameOverDialog: Dialog;
  #playerInput = defaultActions;
  #playerCurrentLives: number;

  constructor(
    canvas: HTMLCanvasElement,
    imageCache: ImageCache,
    options: { backgroundColor: string }
  ) {
    const context2d = canvas.getContext('2d');
    if (context2d) {
      this.#ctx = context2d;
    } else {
      throw new Error('No canvas context found.');
    }
    this.#canvas = canvas;
    this.#imageCache = imageCache;
    this.#width = canvas.width || 1200;
    this.#height = canvas.height || 900;
    this.#backgroundColor = options.backgroundColor;
    this.#score = new Score(this.#ctx);
    this.#outpost = new Outpost(this.#ctx, this.#canvas);
    this.#playerCurrentLives = this.#initialPlayerLives;
  }

  public init = async () => {
    new Input(this.#handleInput);
    this.#explosion = new Explosion(this.#imageCache, this.#ctx, this.#canvas);
    this.#laser = new Laser(this.#imageCache, this.#ctx, this.#outpost);
    this.#player = new Player(this.#imageCache, this.#ctx, this.#canvas);
    this.#armada = new Armada(
      this.#imageCache,
      this.#ctx,
      this.#canvas,
      this.#endGame,
      this.#outpost.reset
    );
    this.#score = new Score(this.#ctx);
    this.#startDialog = new Dialog(this.#ctx, this.#canvas, 24, [
      this.#startText,
    ]);
    this.#gameOverDialog = new Dialog(this.#ctx, this.#canvas, 24, [
      this.#gameOverText,
    ]);
    this.#tryAgainDialog = new Dialog(
      this.#ctx,
      this.#canvas,
      14,
      [this.#tryAgainText],
      24
    );
    this.#bombardment = new Bombardment(
      this.#imageCache,
      this.#ctx,
      this.#canvas,
      this.#armada,
      this.#player,
      this.#killPlayer,
      this.#outpost
    );
    this.#playerLives = new PlayerLives(
      this.#imageCache,
      this.#ctx,
      this.#canvas
    );
    this.#loop();
  };

  get armada() {
    return this.#armada;
  }

  get outpost() {
    return this.#outpost;
  }

  get player() {
    return this.#player;
  }

  get score() {
    return this.#score;
  }

  #handleInput = (actions: Actions) => {
    if (actions.FIRE) {
      if (this.#gameStarted && !this.#playerDead) {
        this.#laser.fire();
      } else {
        this.#gameStarted = true;
        this.#score.reset();
      }
    }
    this.#playerInput = actions;
  };

  #endGame = () => {
    this.#gameStarted = false;
    this.#gameOver = true;
    this.#playerCurrentLives = this.#initialPlayerLives;
    this.#armada.reset();
    this.#bombardment.reset();
    this.#outpost.reset();
  };

  #paintBg = () => {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.#ctx.fillStyle = this.#backgroundColor;
    this.#ctx.fillRect(0, 0, this.#width, this.#height);
  };

  #renderOverlay = () => {
    this.#ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
    this.#ctx.fillRect(0, 0, this.#width, this.#height);
  };

  #playerDeadPause = () => {
    this.#playerDeadTicks += 1;

    if (this.#playerDeadTicks > this.#maxDeadTicks) {
      this.#playerDeadTicks = 0;
      this.#playerDead = false;
      this.#player.sprite.show();
    }
  };

  #update = () => {
    if (this.#playerDead) {
      if (this.#playerCurrentLives <= 0) {
        this.#endGame();
      }
      this.#playerDeadPause();
    } else {
      const playerCannon = {
        x: this.#player.position().x + this.#player.width() / 2,
        y: this.#player.position().y,
      };

      this.#laser.update(
        playerCannon,
        this.#armada,
        this.#explosion,
        this.#score
      );
      this.#player.update(this.#playerInput);
      this.#armada.update();
      this.#bombardment.update();
    }
  };

  #render = () => {
    this.#paintBg();
    this.#explosion.render();
    this.#laser.render();
    this.#player.render();
    this.#armada.render();
    this.#bombardment.render();
    this.#playerLives.render(this.#playerCurrentLives);
    this.#outpost.render();

    if (!this.#gameStarted) {
      this.#renderOverlay();
      if (!this.#gameOver) {
        this.#startDialog.render();
      } else {
        this.#gameOverDialog.render();
        this.#tryAgainDialog.render();
      }
    }

    this.#score.render();
  };

  #killPlayer = () => {
    this.#playerCurrentLives -= 1;
    this.#playerDead = true;
    this.#player.sprite.hide();
    this.#explosion.sprite().moveTo(this.#player.sprite.position());
    this.#explosion.sprite().play();
  };

  #loop = () => {
    if (this.#gameStarted) {
      this.#update();
    }
    this.#render();

    window.requestAnimationFrame(this.#loop);
  };
}

export default Game;
