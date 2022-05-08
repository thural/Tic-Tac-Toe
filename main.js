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
    if (playerMark == 'X') playerMark = 'O', botPlaysImpossible()
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

const getLinesWith = (numOfMark, mark) => {
    let numOfEmpty = 3 - numOfMark;
    if (mark == '') numOfEmpty = 3;

    let matchingLines = logicalLines.filter(line => {

        let countOfMark = 0;
        let countOfEmpty = 0;
        //if(numOfEmpty == undefined) countOfEmpty = countOfMark, console.log('numOfEmpty is undefined')

        line.forEach(cell => {
            if (cells[cell] == mark) countOfMark ++
            if (cells[cell] == '') countOfEmpty ++
        });
        
        if (countOfMark == numOfMark) {
            if (countOfEmpty == numOfEmpty) return true
        }

    });

    return matchingLines
};

const popRandom = (array) => {
    const randomIndex = Math.floor((Math.random() * array.length) + 0.1);
    const newArray = array.splice(randomIndex, 1);
    return newArray
};

const drawsMark = (mark, cell) => {
    const targetCell = document.querySelector(`[cell = '${cell}']`);
    targetCell.textContent = `${mark}`;
};

const marksCellWithin = (lines) => {
    let continues = false;
    if(playerMark == 'O') if (lines.length) continues = true;

    if (continues) lines.forEach(line => {

        if (continues) line.forEach(cell => {
            if (continues) if (cells[cell] == '') {
                cells[cell] = 'O';
                drawsMark('O', cell);
                switchPlayer();
                continues = false
            }
        })

    })
};

const concatArraysOfArray  = (arrays) => {
    let concat = [];
  
    arrays.forEach(array => {
      array.forEach (elem => concat.push(elem))
    });
  
    return concat
  };

  const findMostRepeatedElem = (array) => {
    
    let theElem;
    let prevCount = 0;
    let count = 0;
    
    array.forEach(elem => {  
    
      array.forEach(otherElem => {
        if (otherElem == elem) count++
      });
    
      if (count > prevCount) {
        theElem = elem;
        prevCount = count
      }
    
      count = 0;
        
    });
    return theElem
  };

const mostIntersectingCell = (array1, array2) => {

    
    let allArray1Elems = concatArraysOfArray(array1);
    let allArray2Elems = concatArraysOfArray(array2);
    let allElems = allArray1Elems.filter(elem => allArray2Elems.includes(elem))
    let allCleanElems = allElems.filter(elem => cells[elem] == '');
    let theElem = findMostRepeatedElem (allCleanElems);
  
    return [[theElem]]
  
  };
////////////////////////////////
const botPlaysEasy = () => {

    let cleanLine = getLinesWith(3, '');
    let hasEmpty = getLinesWith(1, '');
    let linesWithOneO = getLinesWith(1, 'O');
    let linesWithTwoO = getLinesWith(2, 'O');
    let linesWithTwoX = popRandom (getLinesWith(2, 'X'));

    marksCellWithin(linesWithTwoO)
    marksCellWithin(linesWithTwoX)
    marksCellWithin(linesWithOneO)
    marksCellWithin(cleanLine)
    marksCellWithin(hasEmpty)
};

const botPlaysHard = () => {

    let cleanLine = getLinesWith(3, '');
    let hasEmpty = getLinesWith(1, '');
    let linesWithOneO = getLinesWith(1, 'O');
    let linesWithTwoO = getLinesWith(2, 'O');
    let linesWithTwoX = getLinesWith(2, 'X');
    let linesWithOneX = getLinesWith(1, 'X');

    marksCellWithin(linesWithTwoX)
    marksCellWithin(linesWithOneX)
    marksCellWithin(linesWithTwoO)
    marksCellWithin(linesWithOneO)
    marksCellWithin(cleanLine)
    marksCellWithin(hasEmpty)
};





////////////////////////////////////////////////////////////////////////////////
const botPlaysImpossible = () => {
    let linesWithOneO = getLinesWith(1, 'O');
    let linesWithTwoO = getLinesWith(2, 'O');
    let linesWithTwoX = getLinesWith(2, 'X');
    let linesWithOneX = getLinesWith(1, 'X');
    
    marksCellWithin(linesWithTwoO)
    marksCellWithin(linesWithTwoX)
    
    /////////////////////// edit below only
    if (cells[5] == '') {
        if (linesWithOneX.length == 3) marksCellWithin([concatArraysOfArray(linesWithOneX).filter(cell => [5].includes(cell))])
        else marksCellWithin([concatArraysOfArray(linesWithOneX).filter(cell => [1,3,7,9].includes(cell))])
    } else if (cells[5] == 'X') marksCellWithin ([concatArraysOfArray(linesWithOneX).filter(cell => [1,3,7,9].includes(cell))])
    else if (linesWithOneX.length == 4) marksCellWithin ([concatArraysOfArray(linesWithOneX).filter(cell => [2,4,6,8].includes(cell))])
    else marksCellWithin ([concatArraysOfArray(linesWithOneX).filter(cell => [1,3,7,9].includes(cell))])
    marksCellWithin(linesWithOneX)    
};