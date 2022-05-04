let playerMark = 'X';
let roundCount = 1;
let cells = new Array(10);

const cellBoard = document.querySelectorAll('[cell]');
const message = document.querySelector('.message');

let lines = [];

const refreshLines = () => {
    lines = [
        [cells[1], cells[2], cells[3]],
        [cells[4], cells[5], cells[6]],
        [cells[7], cells[8], cells[9]],
        [cells[1], cells[4], cells[7]],
        [cells[2], cells[5], cells[8]],
        [cells[3], cells[6], cells[9]],
        [cells[1], cells[5], cells[9]],
        [cells[3], cells[5], cells[7]]
    ];
};
refreshLines()

const markInLines = (playersMark) => {
    let selectedLines = [];

    lines.forEach(line => {
        if (line.includes(playersMark)) selectedLines.push(line)
    });
    return selectedLines
};

const filledLine = (playersMark) => {
    let selectedLines = markInLines(playersMark);
    let won = false;
    let winningLine = [];

    selectedLines.forEach(pattern => {
        let count = 0;
        pattern.forEach(element => {
            if (element == playersMark) count++
        });
        if (count == 3) won = true, winningLine = pattern
        else count = 0
    });

    if (won) return { won, winningLine }
    else return false
};

cellBoard.forEach(cell => cell.addEventListener('click', (e) => {
    const mark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');
    if (mark == '') {
        e.target.textContent = playerMark;
        cells[cellNumber] = playerMark;
        refreshLines();
        filledLine(playerMark).won ? roundOver() : switchPlayer()
    }
})

);

const switchPlayer = () => {
    if (playerMark == 'X') playerMark = 'O'
    else playerMark = 'X'
};

const roundOver = () => {
    roundCount++;
    playerMark = 'X';
    newRound();
}

const newRound = () => {
    message.textContent = `round ${roundCount}`;
    cellBoard.forEach(cell => cell.textContent = '');
    cells = new Array(10)
}

const gamePlay = () => {

}