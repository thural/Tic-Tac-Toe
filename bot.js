const botFactory = (mode) => {
    let turn = true;

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

    const getLines = (markCount, mark) => {

        let numEmpty = 3 - markCount;
        if (mark == '') numEmpty = 3;

        let matchingLines = board.lines.filter(line => {

            let countMark = 0;
            let countEmpty = 0;

            line.forEach(cell => {
                if (board.cells[cell] == mark) countMark++
                if (board.cells[cell] == '') countEmpty++
            });

            if (countMark == markCount) {
                if (countEmpty == numEmpty) return true
            }

        });

        return filterDublicates(
            concatArrays(matchingLines).filter(
                cell => board.cells[cell] == ''
            )
        )
    };

    const marksCell = (lines) => {

        let continues = false;
        if (this.turn == true) if (lines.length) continues = true;

        if (continues) lines.forEach(cell => {
            if (continues) if (board.cells[cell] == '') {
                board.cells[cell] = 'O';
                const targetCell = document.querySelector(`[cell = '${cell}']`);
                targetCell.textContent = 'O';
                continues = false;
                this.turn = false;
                player.plays()
            }
        })

    };

    let score = 0;

    const plays = {
        impossible: () => {
            this.turn = true;
            let linesTwoO = getLines(2, 'O');
            let linesTwoX = getLines(2, 'X');
            let linesOneX = getLines(1, 'X');
            let linesOneO = getLines(1, 'O');

            marksCell(linesTwoO);
            marksCell(linesTwoX);

            if (board.cells[5] == '') {

                if (linesOneX.length == 6) marksCell([5])
                else if (linesOneX.length == 4) marksCell([5])
                else if (linesOneO.length) marksCell(linesOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
                else marksCell(linesOneX.filter(cell => [2, 4, 6, 8].includes(cell)))

            } else if (board.cells[5] == 'X') marksCell(linesOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
            else if (linesOneX.length == 6) marksCell(linesOneX.filter(cell => [2, 4, 6, 8].includes(cell)))
            else marksCell(linesOneX.filter(cell => [1, 3, 7, 9].includes(cell)));
            marksCell(linesOneX)
        },

        hard: () => {
            this.turn = true;
            let linesOneO = getLines(1, 'O');
            let linesTwoO = getLines(2, 'O');
            let linesTwoX = getLines(2, 'X');
            let linesOneX = getLines(1, 'X');

            marksCell(linesTwoO);
            marksCell(linesTwoX);
            if (board.cells[5] == '') {
                if (linesOneX.length == 6) marksCell([5])
                else marksCell(linesOneX.filter(cell => [2, 4, 6, 8].includes(cell)))
            } else if (board.cells[5] == 'X') marksCell(linesOneX.filter(cell => [1, 3, 7, 9].includes(cell)))
            else marksCell(linesOneX.filter(cell => [2, 4, 6, 8].includes(cell)));
            marksCell(linesOneX);
            marksCell(linesOneO)
        },

        easy: () => {
            this.turn = true;
            let cleanLine = getLines(3, '');
            let hasEmpty = getLines(1, '');
            let linesOneX = getLines(1, 'X');
            let linesTwoO = getLines(2, 'O');
            let linesTwoX = getLines(2, 'X');

            marksCell(linesTwoO);
            marksCell(linesTwoX);
            marksCell(linesOneX);
            marksCell(cleanLine);
            marksCell(hasEmpty)

        }
    };

    return { plays: plays[mode], score, turn }

};