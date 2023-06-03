import Game from './Game.js';
import ImageCache from './ImageCache.js';
const canvas = document.createElement('canvas');
const canvasWrapper = document.getElementById('canvasWrapper');
canvas.width = 1200;
canvas.height = 900;

if (canvasWrapper) {
  canvasWrapper.append(canvas);
} else {
  throw new Error('Missing canvas target.');
}

const startGame = async () => {
  const images = [
    'alien1',
    'alien2',
    'alien3',
    'bomb',
    'explosion',
    'hero',
    'laser',
  ].map((img) => `/images/${img}.png`);

  const gameOptions = { backgroundColor: 'black' };

  const imageCache = new ImageCache();
  await imageCache._cacheImages(images);

  const game = new Game(canvas, imageCache, gameOptions);

  game.init();
};

startGame();
