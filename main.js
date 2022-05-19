const gridCells = document.querySelectorAll('[cell]');
const message = document.querySelector('.message');
const modeBtns = document.querySelectorAll('.modes > .button');
const crown = document.createElement('img');
crown.src = './crown.svg';

class Game {
    constructor() {
        this.roundCount = 1;
    }

    newRound() {
        this.refreshDisplay();
        gridCells.forEach(cell => cell.textContent = '');
        board = new Board;
        mark = 'X';
        this.resetPlayingClass()
    }

    roundState(mark) {

        let match = false;
        let winningLine = [];

        board.lines.forEach(line => {
            let count = 0;

            line.forEach(cell => {
                if (board.cells[cell] == mark) count++
            });

            if (count == 3) match = true, winningLine = line
            else count = 0
        });

        return { match, mark, winningLine }
    }

    refreshDisplay() {
        message.textContent = `round ${this.roundCount}`;
        document.querySelector('.player.one .score').textContent = `Player One ${player.score}`;
        document.querySelector('.player.two .score').textContent = `Player Two ${bot.score}`
    }

    displayWinner(mark) {
        if (mark == 'X') {
            document.querySelector('.player.one > .crown').appendChild(crown);
            document.querySelector('.player.one > .crown').firstChild.classList.add('animate')
        } else {
            document.querySelector('.player.two > .crown').appendChild(crown);
            document.querySelector('.player.two > .crown').firstChild.classList.add('animate')
        };
        message.textContent = 'Play again?'
    }

    removeCrown() {
        if (document.querySelector('.crown img')) document.querySelector('.crown img').remove()
    }

    resetPlayingClass() {
        document.querySelector('.player.one .score').classList.remove('playing');
        document.querySelector('.player.two .score').classList.remove('playing');
        document.querySelector('.player.one .score').classList.add('playing')
    }

    shiftPlayingClass() {
        document.querySelector('.player.one .score').classList.toggle('playing')
        document.querySelector('.player.two .score').classList.toggle('playing')
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
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ]
    }

    createCells(repeats, value) {
        let object = {};
        for (let i = 1; i <= repeats; i++) {
            object[i] = value
        }
        return object
    }

    hasEmptyCell() {

        for (let key in this.cells) {
            if (this.cells[key] == '') return true
        };

        return false
    }
};

let mark = 'X';
let mode = 'hard';
let game = new Game;
let board = new Board;
let player = new Player;
let bot = botFactory(mode);

modeBtns.forEach(button => button.addEventListener('click', (e) => {
    document.querySelector('.selected').classList.toggle('selected');
    e.target.classList.add('selected');
    mode = e.target.textContent;
    newGame(mode)
}));

gridCells.forEach(cell => cell.addEventListener('click', (e) => {
    const mark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');

    //if (!player.turn) return
    //else player.plays();

    if (isGameOver() || mark == 'O') return
    if (mark == '') {
        e.target.textContent = 'X';
        board.cells[cellNumber] = 'X';
        if (!isGameOver()) playRound();
    }
}));

message.addEventListener('click', () => {
    if (message.textContent == 'Play again?') {
        newGame();
        updateState({ match: false, mark: 'X' })
    }
});
///////////////////////////////////////////////////////////////////////////

const updateState = (state) => {
    if (state.mark == 'X') {
        if (state.match) player.score++
    }
    else {
        if (state.match) bot.score++
    };
    game.refreshDisplay();
    game.roundCount++;
};

const isGameOver = () => {
    return (player.score == 3 || bot.score == 3)
};

const newGame = (mode) => {
    bot = botFactory(mode);
    player = new Player;
    game = new Game;
    game.removeCrown();
    game.refreshDisplay();
    game.newRound()
};

const playRound = () => {

    game.shiftPlayingClass();
    const state = game.roundState(mark);

    if (mark == 'X') mark = 'O', setTimeout(bot.plays, 1000);
    else mark = 'X';

    if (state.match) {
        updateState(state);
        isGameOver() ? game.displayWinner(state.mark) : game.newRound()
    };

    if (!board.hasEmptyCell()) game.roundCount++, game.newRound();

};