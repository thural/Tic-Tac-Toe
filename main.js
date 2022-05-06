let playerMark = 'X';
let roundCount = 1;

const createObject = (repeats, value) => {
    let object = {};
    for (let i = 1; i <= repeats; i++) {
        object[i] = value
    }
    return object
};

let cells = createObject(9, '');

const allCells = document.querySelectorAll('[cell]');
const message = document.querySelector('.message');

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

const markInLines = (playerMark) => {
    let selectedLines = [];

    logicalLines.forEach(line => {
        const present = () => {
            let isTrue = false;
            line.forEach(cell => {
                if (cells[cell] == playerMark) isTrue = true
            })
            return isTrue
        }
        if (present) selectedLines.push(line)
    });
    return selectedLines
};

const filledLine = (playerMark) => {
    let selectedLines = markInLines(playerMark);
    let won = false;
    let winningLine = [];

    selectedLines.forEach(line => {
        let count = 0;
        line.forEach(cell => {
            if (cells[cell] == playerMark) count++
        });
        if (count == 3) won = true, winningLine = line
        else count = 0
    });

    if (won) return { won, winningLine }
    else return false
};

allCells.forEach(cell => cell.addEventListener('click', (e) => {
    const mark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');
    if (mark == '') {
        e.target.textContent = playerMark;
        cells[cellNumber] = playerMark;
        filledLine(playerMark).won ? roundOver() : switchPlayer()
    }
})

);

const switchPlayer = () => {
    if (playerMark == 'X') playerMark = 'O', botPlaysHard()
    else playerMark = 'X'
};

const roundOver = () => {
    roundCount++;
    playerMark = 'X';
    newRound();
}

const newRound = () => {
    message.textContent = `round ${roundCount}`;
    allCells.forEach(cell => cell.textContent = '');
    cells = new Array(10)
};

const gamePlay = () => {

};

const getLinesWith = (number, mark) => {
    let lines = [];

    logicalLines.forEach(line => {
        let continues = true;
        let count = 0;
        let hasEmptyCell = false;

        if (continues) line.forEach(cell => {
            if (cells[cell] == mark) count++
            if (cells[cell] == '') hasEmptyCell = true
        });

        if (count >= number) {
            if (hasEmptyCell) lines.push(line)
            else count = 0
        } else count = 0
    });

    return lines
}

const popRandomElem = (array) => {
    const randomIndex = Math.floor((Math.random() * array.length) + 0.1);
    const newArray = array.splice(randomIndex, 1);
    return newArray
};

const drawsMark = (mark, cell) => {
    const targetCell = document.querySelector(`[cell = '${cell}']`);
    targetCell.textContent = `${mark}`;
};

const marksCellWithin = (lines) => {
    let continues = true;

    if (continues) lines.forEach(line => {

        if (continues) line.forEach(cell => {
            if (continues) if (cells[cell] == '') {
                cells[cell] = 'O';
                console.log(line);
                drawsMark('O', cell);
                switchPlayer();
                continues = false
            }
        })

    })
};

const botPlaysEasy = () => {

    let cleanLine = getLinesWith(3, '');
    let hasEmpty = getLinesWith(1, '');
    let linesWithOneO = getLinesWith(1, 'O');
    let linesWithTwoO = getLinesWith(2, 'O');
    let linesWithTwoX = popRandomElem (getLinesWith(2, 'X'));

    if (linesWithTwoX.length) marksCellWithin(linesWithTwoX)
    else if (linesWithTwoO.length) marksCellWithin(linesWithTwoO)
    else if (linesWithOneO.length) marksCellWithin(linesWithOneO)
    else if (cleanLine.length) marksCellWithin(cleanLine)
    else marksCellWithin(hasEmpty)
};

const botPlaysHard = () => {

    let cleanLine = getLinesWith(3, '');
    let hasEmpty = getLinesWith(1, '');
    let linesWithOneO = getLinesWith(1, 'O');
    let linesWithTwoO = getLinesWith(2, 'O');
    let linesWithTwoX = getLinesWith(2, 'X');
    let linesWithOneX = getLinesWith(1, 'X');

    if (linesWithTwoX.length) marksCellWithin(linesWithTwoX)
    else if (linesWithOneX.length) marksCellWithin(linesWithOneX)
    else if (linesWithTwoO.length) marksCellWithin(linesWithTwoO)
    else if (linesWithOneO.length) marksCellWithin(linesWithOneO)
    else if (cleanLine.length) marksCellWithin(cleanLine)
    else marksCellWithin(hasEmpty)
};