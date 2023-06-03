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
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  images: string[];
  backgroundColor: string;
  imageCache: ImageCache;
  player: Player;
  armada: Armada;
  laser: Laser;
  explosion: Explosion;
  outpost: Outpost;
  maxDeadTicks: number;
  initialPlayerLives: number;
  bombardment: Bombardment;
  score: Score;
  playerLives: PlayerLives;
  tryAgainDialog: Dialog;
  startDialog: Dialog;
  gameOverDialog: Dialog;
  playerDead: boolean;
  playerInput: Actions;
  sprites: Sprite[];
  gameStarted: boolean;
  gamePaused: boolean;
  gameOver: boolean;
  playerDeadTicks: number;
  playerCurrentLives: number;

  constructor(
    canvas: HTMLCanvasElement,
    imageCache: ImageCache,
    options: { backgroundColor: string }
  ) {
    this.canvas = canvas;
    const context2d = canvas.getContext('2d');
    if (context2d) {
      this.ctx = context2d;
    } else {
      throw new Error('No canvas context found.');
    }
    this.width = canvas.width || 1200;
    this.height = canvas.height || 900;
    this.backgroundColor = options.backgroundColor;
    this.maxDeadTicks = 100;
    this.initialPlayerLives = 3;
    this.score = new Score(this.ctx);
    this.outpost = new Outpost(this.ctx, this.canvas);
    this.imageCache = imageCache;
    this.playerDead = false;
    this.playerInput = defaultActions;
    this.sprites = [];
    this.gameStarted = false;
    this.gamePaused = false;
    this.gameOver = false;
    this.playerDeadTicks = 0;
    this.playerCurrentLives = this.initialPlayerLives;
  }

  init = async () => {
    new Input(this._handleInput);
    this.explosion = new Explosion(this.imageCache, this.ctx, this.canvas);
    this.laser = new Laser(this.imageCache, this.ctx, this.outpost);
    this.player = new Player(this.imageCache, this.ctx, this.canvas);
    this.armada = new Armada(
      this.imageCache,
      this.ctx,
      this.canvas,
      this._gameOver,
      this.outpost.reset
    );
    this.score = new Score(this.ctx);
    this.startDialog = new Dialog(this.ctx, this.canvas, 24, [
      'Press [SPACE] to start a game.',
    ]);
    this.gameOverDialog = new Dialog(this.ctx, this.canvas, 24, ['Game Over!']);
    this.tryAgainDialog = new Dialog(
      this.ctx,
      this.canvas,
      14,
      ['Press [SPACE] to try again.'],
      24
    );
    this.bombardment = new Bombardment(
      this.imageCache,
      this.ctx,
      this.canvas,
      this.armada,
      this.player,
      this.killPlayer,
      this.outpost
    );
    this.playerLives = new PlayerLives(this.imageCache, this.ctx, this.canvas);
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
    const { backgroundColor, ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  };

  _renderOverlay = () => {
    const { ctx, width, height } = this;
    ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
    ctx.fillRect(0, 0, width, height);
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
