const cells = document.querySelectorAll('[cell]');
const message = document.querySelector('.message');
const modeBtns = document.querySelectorAll('.modes > .button');
const crown = document.createElement('img');
crown.src = './crown.svg';

modeBtns.forEach(button => button.addEventListener('click', (e) => {
    document.querySelector('.selected').classList.toggle('selected');
    e.target.classList.add('selected');
    game.mode = e.target.textContent;
    newGame(game.mode)
}));

cells.forEach(cell => cell.addEventListener('click', (e) => {

    const cellMark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');

    if (!player.turn) return
    if (game.over() || cellMark == 'O') return
    if (cellMark != '') return
    e.target.textContent = 'X';
    board.cells[cellNumber] = 'X';
    player.plays();
    setTimeout(playRound, 500);

}));

message.addEventListener('click', () => {
    if (message.textContent == 'Play again?') {
        newGame(game.mode);
        refreshScore({ match: false, mark: 'X' })
    }
});

class Display {

    constructor() {
        this.cells = document.querySelectorAll('[cell]');
        this.message = document.querySelector('.message');
        this.crown = crown
    }

    score() {
        message.textContent = `round ${round.count}`;
        document.querySelector('.player.one .score').textContent = `Player One ${player.score}`;
        document.querySelector('.player.two .score').textContent = `Player Two ${bot.score}`
    }

    winner() {
        const elem = document.querySelector(`.player.${!player.turn?'one':'two'} > .crown`)
        elem.appendChild(crown);
        elem.firstChild.classList.add('animate');
        message.textContent = 'Play again?'
    }

    removeCrown() {
        if (document.querySelector('.crown img')) document.querySelector('.crown img').remove()
    }

}

class Game {
    constructor() {
        this.mode = 'hard';
    }

    over() {
        return (player.score == 3 || bot.score == 3)
    }
};

class Round {
    constructor() {
        this.count = 1
    }

    state() {
        let mark = undefined
        if (!player.turn) mark = 'X'
        else mark = 'O';

        let over = false;
        let winningLine = [];

        board.lines.forEach(line => {
            let count = 0;

            line.forEach(cell => {
                if (board.cells[cell] == mark) count++
            });

            if (count == 3) over = true, winningLine = line
            else count = 0
        });

        return { over, mark, winningLine }
    }

    rebuild() {
        display.score();
        cells.forEach(cell => cell.textContent = '');
        player.turn = true;
        board = new Board;
    }

};

class Player {
    constructor() {
        this.score = 0;
        this.turn = true
    }

    plays() { this.turn = !this.turn }
};

class Board {
    constructor() {
        this.cells = this.createCells(9, '');
        this.lines = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ]
    }

    createCells(repeats, value) {
        let object = {};
        for (let i = 1; i <= repeats; i++) {
            object[i] = value
        }
        return object
    }

    filled() {
        for (let key in this.cells) {
            if (this.cells[key] == '') return false
        };
        return true
    }
};

let game = new Game;
let round = new Round;
let board = new Board;
let player = new Player;
let display = new Display;
let bot = botFactory(game.mode);

const refreshScore = () => {
    if (player.turn) bot.score++
    else player.score++
    display.score();
    round.count++;
};

const newGame = (mode) => {
    bot = botFactory(mode);
    player = new Player;
    game = new Game;
    display.removeCrown();
    display.score();
    round.rebuild()
};

const playRound = () => {

    if (board.filled()) {
        round.count++;
        round.rebuild();
        return
    };

    if (round.state().over) {
        refreshScore();
        if (game.over()) display.winner()
        else round.rebuild()
    } else {
        bot.plays()
        if (round.state().over) {
            refreshScore();
            if (game.over()) display.winner()
            else round.rebuild()
        }
    }
};