let mode = 'easy';
let mark = 'X';
let roundCount = 1;
let playerOneScore = 0;
let playerTwoScore = 0;

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
    if (mark == '') {
        e.target.textContent = 'X';
        cells[cellNumber] = 'X';
        playRound();
    }
}));

const hasEmptyCell = () => {
    let hasEmpty = false;

    for (key in cells) {
        if (cells[key] == '') hasEmpty = true
    };

    return hasEmpty
};

const getLines = (mark) => {
    let targetLines = [];

    logicalLines.forEach(line => {
        const present = () => {
            line.forEach(cell => {
                if (cells[cell] == mark) return true
            })
            return false
        };
        if (present) targetLines.push(line)
    });

    return targetLines
};

const getState = (mark) => {
    let targetLines = getLines(mark);
    let won = false;
    let winningLine = [];

    targetLines.forEach(line => {
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
    console.log(state);
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

const gameStart = (mode) => {
    bot = {
        score: 0,
        plays: botPlays(mode)
    };
    newRound()
};

const playRound = () => {
    const state = getState(mark);

    if (mark == 'X') mark = 'O', bot.plays()
    else mark = 'X';

    if (state.won) updateState(state), newRound();
    if (!hasEmptyCell()) roundCount++, newRound();



};


const botPlays = (mode) => {

    const concatArrays = (arraysInArray) => {
        let concat = [];

        arraysInArray.forEach(array => {
            array.forEach(elem => concat.push(elem))
        });

        return concat
    };

    const filterDublicates = (array) => {
        let unique = [];

        array.forEach(elem => {
            if (!(unique.includes(elem))) unique.push(elem)
        });

        return unique
    };

    const getLinesWith = (numMark, mark) => {
        let numEmpty = 3 - numMark;
        if (mark == '') numEmpty = 3;

        let matchingLines = logicalLines.filter(line => {

            let countMark = 0;
            let countEmpty = 0;

            line.forEach(cell => {
                if (cells[cell] == mark) countMark++
                if (cells[cell] == '') countEmpty++
            });

            if (countMark == numMark) {
                if (countEmpty == numEmpty) return true
            }

        });

        return filterDublicates(
            concatArrays(matchingLines).filter(
                cell => cells[cell] == ''
            )
        )
    };

    const marksCell = (lines) => {

        let continues = false;
        if (mark == 'O') if (lines.length) continues = true;

        if (continues) lines.forEach(cell => {
            if (continues) if (cells[cell] == '') {
                cells[cell] = 'O';
                const targetCell = document.querySelector(`[cell = '${cell}']`);
                targetCell.textContent = 'O';
                playRound();
                mark = 'X';
                continues = false
            }
        })

    }

    const plays = {
        impossible: () => {

            let linesWithTwoO = getLinesWith(2, 'O');
            let linesWithTwoX = getLinesWith(2, 'X');
            let linesWithOneX = getLinesWith(1, 'X');
            let linesWithOneO = getLinesWith(1, 'O');

            marksCell(linesWithTwoO);
            marksCell(linesWithTwoX);

            if (cells[5] == '') {

                if (linesWithOneX.length == 6) marksCell([5])
                else if (linesWithOneX.length == 4) marksCell([5])
                else if (linesWithOneO.length) marksCell(linesWithOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
                else marksCell(linesWithOneX.filter(cell => [2, 4, 6, 8].includes(cell)))

            } else if (cells[5] == 'X') marksCell(linesWithOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
            else if (linesWithOneX.length == 6) marksCell(linesWithOneX.filter(cell => [2, 4, 6, 8].includes(cell)))
            else marksCell(linesWithOneX.filter(cell => [1, 3, 7, 9].includes(cell)));
            marksCell(linesWithOneX)
        },

        hard: () => {

            let linesWithOneO = getLinesWith(1, 'O');
            let linesWithTwoO = getLinesWith(2, 'O');
            let linesWithTwoX = getLinesWith(2, 'X');
            let linesWithOneX = getLinesWith(1, 'X');

            marksCell(linesWithTwoO);
            marksCell(linesWithTwoX);
            if (cells[5] == '') {
                if (linesWithOneX.length == 6) marksCell([5])
                else marksCell(linesWithOneX.filter(cell => [2, 4, 6, 8].includes(cell)))
            } else if (cells[5] == 'X') marksCell(linesWithOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
            else marksCell(linesWithOneX.filter(cell => [2, 4, 6, 8].includes(cell)));
            marksCell(linesWithOneX);
            marksCell(linesWithOneO)
        },

        easy: () => {

            let cleanLine = getLinesWith(3, '');
            let hasEmpty = getLinesWith(1, '');
            let linesWithOneX = getLinesWith(1, 'X');
            let linesWithTwoO = getLinesWith(2, 'O');
            let linesWithTwoX = getLinesWith(2, 'X');

            marksCell(linesWithTwoO);
            marksCell(linesWithTwoX);
            marksCell(linesWithOneX);
            marksCell(cleanLine);
            marksCell(hasEmpty)

        }
    }

    return plays[mode]

};


let bot = {
    score: 0,
    plays: botPlays('easy')
}


