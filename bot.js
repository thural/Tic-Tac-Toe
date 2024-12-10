const botFactory = (mode) => {
  let turn = true;

  const concatArrays = (arrays) => arrays.flat();
  const filterDuplicates = (array) => [...new Set(array)];

  const countMarksAndEmpty = (line, mark) => {
    const countMark = line.filter(cell => board.cells[cell] === mark).length;
    const countEmpty = line.filter(cell => board.cells[cell] === '').length;
    return { countMark, countEmpty };
  };

  const getPotentialMoves = (markCount, mark) => {
    const requiredEmpty = mark === '' ? 3 : 3 - markCount;
    return filterDuplicates(
      concatArrays(
        board.lines.filter(line => {
          const { countMark, countEmpty } = countMarksAndEmpty(line, mark);
          return countMark === markCount && countEmpty === requiredEmpty;
        })
      ).filter(cell => board.cells[cell] === '')
    );
  };

  const markCell = (cell) => {
    if (board.cells[cell] === '') {
      board.cells[cell] = 'O';
      document.querySelector(`[cell='${cell}']`).textContent = 'O';
      turn = false;
      player.plays();
    }
  };

  const evaluateMove = (lines) => {
    if (turn && lines.length > 0) {
      markCell(lines[0]);
    }
  };

  const chooseCenterCell = (linesOneX) => {
    const centerCell = board.cells[5];
    if (centerCell === '') {
      return linesOneX.length === 6 || linesOneX.length === 4 ? [5] : linesOneX.filter(cell => [1, 3, 7, 9].includes(cell));
    } else if (centerCell === 'X') {
      return linesOneX.filter(cell => [1, 3, 7, 9].includes(cell));
    } else {
      return linesOneX.filter(cell => [2, 4, 6, 8].includes(cell));
    }
  };

  const plays = {
    impossible: () => {
      turn = true;
      const linesTwoO = getPotentialMoves(2, 'O');
      const linesTwoX = getPotentialMoves(2, 'X');
      const linesOneX = getPotentialMoves(1, 'X');
      const linesOneO = getPotentialMoves(1, 'O');

      evaluateMove(linesTwoO);
      evaluateMove(linesTwoX);
      evaluateMove(chooseCenterCell(linesOneX));
      evaluateMove(linesOneX);
    },

    hard: () => {
      turn = true;
      const linesOneO = getPotentialMoves(1, 'O');
      const linesTwoO = getPotentialMoves(2, 'O');
      const linesTwoX = getPotentialMoves(2, 'X');
      const linesOneX = getPotentialMoves(1, 'X');

      evaluateMove(linesTwoO);
      evaluateMove(linesTwoX);
      evaluateMove(chooseCenterCell(linesOneX));
      evaluateMove(linesOneX);
      evaluateMove(linesOneO);
    },

    easy: () => {
      turn = true;
      const cleanLine = getPotentialMoves(3, '');
      const hasEmpty = getPotentialMoves(1, '');
      const linesOneX = getPotentialMoves(1, 'X');
      const linesTwoO = getPotentialMoves(2, 'O');
      const linesTwoX = getPotentialMoves(2, 'X');

      evaluateMove(linesTwoO);
      evaluateMove(linesTwoX);
      evaluateMove(linesOneX);
      evaluateMove(cleanLine);
      evaluateMove(hasEmpty);
    }
  };

  return { plays: plays[mode], score: 0, turn };
};
