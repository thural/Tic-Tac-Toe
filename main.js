let mode = 'easy';
let playerMark = 'X';
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

const hasEmptyCell = () => {
    let hasEmpty = false;
    for (key in cells) {
        if (cells[key] == '') hasEmpty = true
    };
    return hasEmpty
};

const getLines = (playerMark) => {
    let selectedLines = [];

    logicalLines.forEach(line => {
        const present = () => {
            line.forEach(cell => {
                if (cells[cell] == playerMark) return true //isTrue = true
            })
        };
        if (present) selectedLines.push(line)
    });
    return selectedLines
};

const getState = (playerMark) => {
    let targetLines = getLines(playerMark);
    let won = false;
    let winningLine = [];

    targetLines.forEach(line => {
        let count = 0;
        line.forEach(cell => {
            if (cells[cell] == playerMark) count++
        });
        if (count == 3) won = true, winningLine = line
        else count = 0
    });

    if (won || !hasEmptyCell()) roundOver({ won, playerMark, winningLine })
    else switchTurn()
};

gridCells.forEach(cell => cell.addEventListener('click', (e) => {
    const mark = e.target.textContent;
    const cellNumber = e.target.getAttribute('cell');
    if (mark == '') {
        e.target.textContent = playerMark;
        cells[cellNumber] = playerMark;
        getState(playerMark)
    }
}));

const switchTurn = () => {
    if (playerMark == 'X') playerMark = 'O', bot.play()
    else playerMark = 'X';
};

const roundOver = (state) => {
    if (state.playerMark == 'X') {
        if(state.won) playerOneScore++;
        document.querySelector('.player.one .score').textContent = `Player One ${playerOneScore}`
    }
    else {
        if(state.won) playerTwoScore++;
        document.querySelector('.player.two .score').textContent = `Player Two ${playerTwoScore}`
    }
    roundCount++;
    playerMark = 'X';
    newRound();
}

const newRound = () => {
    message.textContent = `round ${roundCount}`;
    gridCells.forEach(cell => cell.textContent = '');
    cells = createObject(9, '');
};

const gamePlay = () => {

};

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
}

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

const drawsMark = (mark, cell) => {
    const targetCell = document.querySelector(`[cell = '${cell}']`);
    targetCell.textContent = `${mark}`
};

const marksCell = (lines) => {
    let continues = false;
    if (playerMark == 'O') if (lines.length) continues = true;

    if (continues) lines.forEach(cell => {
        if (continues) if (cells[cell] == '') {
            cells[cell] = 'O';
            drawsMark('O', cell);
            (getState(playerMark).won || !hasEmptyCell()) ? roundOver() : switchTurn();
            continues = false
        }
    })

};

const BotFactory = (mode) => {

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

    return {play:plays[mode]}

};


const bot = BotFactory(mode);