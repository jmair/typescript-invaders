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
import Sprite from './Sprite.js';

class Game {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  #backgroundColor: string;
  player: Player;
  armada: Armada;
  laser: Laser;
  explosion: Explosion;
  outpost: Outpost;
  maxDeadTicks = 100;
  readonly initialPlayerLives = 3;
  bombardment: Bombardment;
  score: Score;
  playerLives: PlayerLives;
  tryAgainDialog: Dialog;
  startDialog: Dialog;
  gameOverDialog: Dialog;
  playerDead = false;
  playerInput: Actions;
  sprites: Sprite[] = [];
  gameStarted = false;
  gamePaused = false;
  gameOver = false;
  playerDeadTicks = 0;
  playerCurrentLives: number;

  constructor(
    public canvas: HTMLCanvasElement,
    public imageCache: ImageCache,
    public options: { backgroundColor: string }
  ) {
    const context2d = canvas.getContext('2d');
    if (context2d) {
      this.#ctx = context2d;
    } else {
      throw new Error('No canvas context found.');
    }
    this.#width = canvas.width || 1200;
    this.#height = canvas.height || 900;
    this.#backgroundColor = options.backgroundColor;
    this.score = new Score(this.#ctx);
    this.outpost = new Outpost(this.#ctx, this.canvas);
    this.playerInput = defaultActions;
    this.playerCurrentLives = this.initialPlayerLives;
  }

  init = async () => {
    new Input(this._handleInput);
    this.explosion = new Explosion(this.imageCache, this.#ctx, this.canvas);
    this.laser = new Laser(this.imageCache, this.#ctx, this.outpost);
    this.player = new Player(this.imageCache, this.#ctx, this.canvas);
    this.armada = new Armada(
      this.imageCache,
      this.#ctx,
      this.canvas,
      this._gameOver,
      this.outpost.reset
    );
    this.score = new Score(this.#ctx);
    this.startDialog = new Dialog(this.#ctx, this.canvas, 24, [
      'Press [SPACE] to start a game.',
    ]);
    this.gameOverDialog = new Dialog(this.#ctx, this.canvas, 24, [
      'Game Over!',
    ]);
    this.tryAgainDialog = new Dialog(
      this.#ctx,
      this.canvas,
      14,
      ['Press [SPACE] to try again.'],
      24
    );
    this.bombardment = new Bombardment(
      this.imageCache,
      this.#ctx,
      this.canvas,
      this.armada,
      this.player,
      this.killPlayer,
      this.outpost
    );
    this.playerLives = new PlayerLives(this.imageCache, this.#ctx, this.canvas);
    this.loop();
  };

  _handleInput = (actions: Actions) => {
    if (actions.FIRE) {
      if (this.gameStarted && !this.playerDead) {
        this.laser.fire();
      } else {
        this.gameStarted = true;
        this.score.reset();
      }
    }
    this.playerInput = actions;
  };

  _gameOver = () => {
    this.gameStarted = false;
    this.gameOver = true;
    this.playerCurrentLives = this.initialPlayerLives;
    this.armada.reset();
    this.bombardment.reset();
    this.outpost.reset();
  };

  _paintBg = () => {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.#ctx.fillStyle = this.#backgroundColor;
    this.#ctx.fillRect(0, 0, this.#width, this.#height);
  };

  _renderOverlay = () => {
    this.#ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
    this.#ctx.fillRect(0, 0, this.#width, this.#height);
  };

  _playerDeadPause = () => {
    this.playerDeadTicks += 1;

    if (this.playerDeadTicks > this.maxDeadTicks) {
      this.playerDeadTicks = 0;
      this.playerDead = false;
      this.player.sprite.show();
    }
  };

  _update = () => {
    if (this.playerDead) {
      if (this.playerCurrentLives <= 0) {
        this._gameOver();
      }
      this._playerDeadPause();
    } else {
      const playerCannon = {
        x: this.player.position().x + this.player.width() / 2,
        y: this.player.position().y,
      };

      this.laser.update(playerCannon, this.armada, this.explosion, this.score);
      this.player.update(this.playerInput);
      this.armada.update();
      this.bombardment.update();
    }
  };

  _render = () => {
    this._paintBg();
    this.explosion.render();
    this.laser.render();
    this.player.render();
    this.armada.render();
    this.bombardment.render();
    this.playerLives.render(this.playerCurrentLives);
    this.outpost.render();

    if (!this.gameStarted) {
      this._renderOverlay();
      if (!this.gameOver) {
        this.startDialog.render();
      } else {
        this.gameOverDialog.render();
        this.tryAgainDialog.render();
      }
    }

    this.score.render();
  };

  killPlayer = () => {
    this.playerCurrentLives -= 1;
    this.playerDead = true;
    this.player.sprite.hide();
    this.explosion.sprite().moveTo(this.player.sprite.position());
    this.explosion.sprite().play();
  };

  pause = () => (this.gamePaused = true);

  resume = () => (this.gamePaused = false);

  loop = () => {
    if (this.gameStarted) {
      this._update();
    }
    this._render();

    window.requestAnimationFrame(this.loop);
  };
}

export default Game;
