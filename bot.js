const botFactory = (mode) => {

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

    };

    let score = 0;

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
    };

    return { plays:plays[mode], score }

};