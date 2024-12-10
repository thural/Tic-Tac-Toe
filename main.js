class DOMHelper {
  static createElement(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.classes) {
      element.classList.add(...options.classes);
    }
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    if (options.text) {
      element.textContent = options.text;
    }
    return element;
  }

  static select(selector, all = true) {
    return all ? document.querySelectorAll(selector) : document.querySelector(selector);
  }
}

class Display {
  constructor() {
    this.cells = DOMHelper.select('[cell]');
    this.message = DOMHelper.select('.message', false);
    this.crown = DOMHelper.createElement('img', { attributes: { src: './crown.svg' } });

    this.bindModeButtons();
    this.bindCellClick();
    this.bindMessageClick();
  }

  score() {
    this.message.textContent = `round ${round.count}`;
    document.querySelector('.player.one .score').textContent = `Player One ${player.score}`;
    document.querySelector('.player.two .score').textContent = `Player Two ${bot.score}`;
  }

  winner() {
    const elem = document.querySelector(`.player.${!player.turn ? 'one' : 'two'} > .crown`);
    elem.appendChild(this.crown);
    elem.firstChild.classList.add('animate');
    this.message.textContent = 'Play again?';
  }

  removeCrown() {
    const crownImg = document.querySelector('.crown img');
    if (crownImg) crownImg.remove();
  }

  resetBoard() {
    this.cells.forEach(cell => cell.textContent = '');
  }

  bindModeButtons() {
    const modeBtns = DOMHelper.select('.modes > .button');
    modeBtns.forEach(button => button.addEventListener('click', (e) => {
      DOMHelper.select('.selected', false).classList.toggle('selected');
      e.target.classList.add('selected');
      game.mode = e.target.textContent.toLowerCase();
      newGame(game.mode);
      refreshScore({ mark: 0 });
    }));
  }

  bindCellClick() {
    this.cells.forEach(cell => cell.addEventListener('click', (e) => {
      const cellMark = e.target.textContent;
      const cellNumber = e.target.getAttribute('cell');
      if (player.turn && !game.over && cellMark === '') {
        e.target.textContent = 'X';
        board.cells[cellNumber] = 'X';
        player.plays();
        playRound();
      }
    }));
  }

  bindMessageClick() {
    this.message.addEventListener('click', () => {
      if (this.message.textContent === 'Play again?') {
        newGame(game.mode);
        refreshScore({ mark: 0 });
      }
    });
  }
}

class Game {
  constructor(mode = 'hard') {
    this.mode = mode;
  }

  get over() {
    return player.score === 3 || bot.score === 3;
  }
}

class Round {
  constructor() {
    this.count = 1;
  }

  get state() {
    const mark = player.turn ? 'O' : 'X';
    const winningLine = board.lines.find(line => line.every(cell => board.cells[cell] === mark));
    return { mark, winningLine };
  }

  rebuild() {
    display.score();
    display.resetBoard();
    player.turn = true;
    board = new Board();
  }
}

class Player {
  constructor() {
    this.score = 0;
    this.turn = true;
  }

  plays() {
    this.turn = !this.turn;
  }
}

class Board {
  constructor() {
    this.cells = this.createCells(9, '');
    this.lines = [
      [1, 2, 3], [4, 5, 6], [7, 8, 9],
      [1, 4, 7], [2, 5, 8], [3, 6, 9],
      [1, 5, 9], [3, 5, 7]
    ];
  }

  createCells(repeats, value) {
    return Array.from({ length: repeats }, (_, i) => i + 1)
      .reduce((acc, num) => ({ ...acc, [num]: value }), {});
  }

  get filled() {
    return !Object.values(this.cells).some(value => value === '');
  }
}

let game = new Game();
let round = new Round();
let board = new Board();
let player = new Player();
let display = new Display();
let bot = botFactory(game.mode);

const refreshScore = (state) => {
  if (state.mark !== 0) {
    state.mark === 'X' ? player.score++ : bot.score++;
  }
  round.count++;
  display.score();
};

const newGame = (mode) => {
  bot = botFactory(mode);
  player = new Player();
  game = new Game();
  display.removeCrown();
  display.score();
  round.rebuild();
  round.count = 0;
};

const playRound = () => {
  const checkWinner = () => {
    if (round.state.winningLine) {
      refreshScore(round.state);
      if (game.over) {
        display.winner();
      } else {
        round.rebuild();
      }
      return true;
    }
    return false;
  };

  if (!checkWinner()) {
    bot.plays();
    if (!checkWinner() && board.filled) {
      round.count++;
      round.rebuild();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  display = new Display();
  game = new Game();
  round = new Round();
  board = new Board();
  player = new Player();
  bot = botFactory(game.mode);
});