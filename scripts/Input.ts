import Keys from '../types/Keys.js';

export interface Actions {
  [Keys.UP]: boolean;
  [Keys.DOWN]: boolean;
  [Keys.LEFT]: boolean;
  [Keys.RIGHT]: boolean;
  [Keys.FIRE]: boolean;
  [Keys.IGNORE]: boolean;
}

export const defaultActions = {
  [Keys.UP]: false,
  [Keys.DOWN]: false,
  [Keys.LEFT]: false,
  [Keys.RIGHT]: false,
  [Keys.FIRE]: false,
  [Keys.IGNORE]: false,
};

class Input {
  #callback: (actions: Actions) => void;
  #actions: Actions;

  constructor(callback: (actions: Actions) => void) {
    this.#callback = callback;
    (this.#actions = defaultActions),
      window.addEventListener('keydown', this.#handleKeyEvent);
    window.addEventListener('keyup', this.#handleKeyEvent);
  }

  #getAction = (key: string) => {
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        return Keys.LEFT;
      case 'd':
      case 'ArrowRight':
        return Keys.RIGHT;
      case ' ':
        return Keys.FIRE;
      default:
        return Keys.IGNORE;
    }
  };

  #handleKeyEvent = (e: KeyboardEvent) => {
    if (!e.repeat) {
      const key = e.key;
      const action = this.#getAction(key);
      this.#actions[action] = e.type === 'keydown';
      this.#callback(this.#actions);
    }
  };
}

export default Input;
