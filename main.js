let mode = 'easy';
let mark = 'X';
let roundCount = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let bot = botFactory(mode);

const createObject = (repeats, value) => {
    let object = {};
    for (let i = 1; i <= repeats; i++) {
        object[i] = value
    }
    return object
};

let cells = createObject(9, '');

const logicalLines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

const gridCells = document.querySelectorAll('[cell]');
const message = document.querySelector('.message');

gridCells.forEach(cell => cell.addEventListener('click', (e) => {
    const mark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');
    if (isGameOver()) return
    if (mark == '') {
        e.target.textContent = 'X';
        cells[cellNumber] = 'X';
        playRound();
    }
}));

message.addEventListener('click', () => {
    if (message.textContent == 'Play again?') {
        roundCount = 0;
        newGame();
        updateState({ won: false, mark: 'X' })
    }
});

const hasEmptyCell = () => {

    for (key in cells) {
        if (cells[key] == '') return true
    };

    return false
};

const getLines = (mark) => {

    let targetLines = logicalLines.filter(line => {
        let found = false;

        line.forEach(cell => {
            if (cells[cell] == mark) found = true
        });

        if (found) return true
    });

    return targetLines
};

const getState = (mark) => {

    let won = false;
    let winningLine = [];

    getLines(mark).forEach(line => {
        let count = 0;

        line.forEach(cell => {
            if (cells[cell] == mark) count++
        });

        if (count == 3) won = true, winningLine = line
        else count = 0
    });

    return { won, mark, winningLine }
};

const updateState = (state) => {

    if (state.mark == 'X') {
        if (state.won) playerOneScore++;
        document.querySelector('.player.one .score').textContent = `Player One ${playerOneScore}`
    }
    else {
        if (state.won) playerTwoScore++;
        document.querySelector('.player.two .score').textContent = `Player Two ${playerTwoScore}`
    };
    roundCount++;
};

const newRound = () => {
    message.textContent = `round ${roundCount}`;
    gridCells.forEach(cell => cell.textContent = '');
    cells = createObject(9, '');
    mark = 'X'
};

const playRound = () => {
    
    const state = getState(mark);

    if (mark == 'X') mark = 'O', bot.plays()
    else mark = 'X';

    if (state.won) {
        updateState(state);
        isGameOver() ? announceWinner() : newRound()
    };

    if (!hasEmptyCell()) roundCount++, newRound();

};

const isGameOver = () => {
    if (playerOneScore == 3 || playerTwoScore == 3) return true
    else return false
};

const announceWinner = () => {
    message.textContent = 'Play again?'
};

const newGame = (mode) => {
    playerOneScore = 0;
    playerTwoScore = 0;
    newRound()
}



