///////////////////////////
////// DOM ELEMENTS
//////////////////////////

const allCells = document.querySelectorAll(".cell:not(.row-top)"); // select elements in html that has a class:cell, except for those with class:row-top. returns as NodeList.
const topCells = document.querySelectorAll(".cell.row-top"); // select elements in html that has a class:cell & class:row-top. returns as NodeList.
const resetButton = document.querySelector(".reset"); // selects elements in html that has a class:reset. returns as NodeList.
const statusSpan = document.querySelector(".status");// selects elements in html that has a class:status. returns as NodeList.


// columns
// set column0, column1, column2 etc variables to an array of the cell elements as indexed 
const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
// set columns variable to an array of the above arrays
const columns = [column0, column1, column2, column3, column4, column5, column6];


// rows
// set topRow, row0, row1, etc. variables to an array of the cell elements as indexed from html 
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
// set rows variable to an array of the above arrays
const rows = [row0, row1, row2, row3, row4, row5, topRow];


///////////////////////
////// VARIABLES
///////////////////////

let gameIsLive = true;
let yellowIsNext = true;                                                                       

//////////////////////
////// FUNCTIONS
//////////////////////

const getClassListArray = (cell) => {
    const classList = cell.classList;
    return (Array.from(classList)); //extract classes of div elements & make them into an array
};

const getCellLocation = (cell) => {
    const classList = getClassListArray(cell);
    const rowClass = classList.find(className => className.includes("row")); //access row & col classes of element as string
    const colClass = classList.find(className => className.includes("col"));
    const rowIndex = rowClass[4]; //index# is 4th character in html class string
    const colIndex = colClass[4];
    const rowIndexAsNumber = parseInt(rowIndex, 10); //turn string into integer with parseInt method
    const colIndexAsNumber = parseInt(colIndex, 10);
    return [rowIndexAsNumber, colIndexAsNumber]; //returns an array of row index & column index 
};

// get first (from the bottom) open cell of column 
// for each cell of columnWithoutTop loop, check if cell has a class of either red or yellow
const getFirstOpenCellInColumn = (colIndex) => {
    const column = columns[colIndex];
    const columnWithoutTop = column.slice(0, 6);

    for (const cell of columnWithoutTop) {
        const classList = getClassListArray(cell);
        if (!classList.includes("yellow") && !classList.includes("red")) {
            return cell;
        }
    }
    return null;
};

const clearColorFromTopCell = (colIndex) => {
    const topCell = topCells[colIndex];
    topCell.classList.remove("yellow");
    topCell.classList.remove("red");
};

const getColorOfCell = (cell) => {
    const classList = getClassListArray(cell);
    if (classList.includes("yellow")) return ("yellow");
    if (classList.includes("red")) return("red");
    return (null);
};

const checkWinningCells = (cells) => {
    if (cells.length < 4) return false;
    
    gameIsLive = false;
    for (const cell of cells) {
        cell.classList.add("win");
    }
    
    statusSpan.textContent = `${yellowIsNext ? 'Yellow' : 'Red'} wins!`
    return true;
};

const checkStatusOfGame = (cell) => {
    const color = getColorOfCell(cell);
    if (!color) return;
    const [rowIndex, colIndex] = getCellLocation(cell); // de-structure elements of array output 

    // CHECK HORIZONTALLY
    let winningCells = [cell]; // set winningCells parameters to array
    let rowToCheck = rowIndex;
    // CHECK HORIZONTALLY TO RIGHT OF CELL
    let colToCheck = colIndex -1;
    while (colToCheck >= 0) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        // console.log("cellToCheck", cellToCheck);
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            colToCheck--;
        } else {
            break;
        }
    }
    // CHECK HORIZONTALLY TO LEFT OF CELL
    colToCheck = colIndex + 1;
    while (colToCheck <= 6) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            colToCheck++;
        } else {
            break;
        }
    }
    let isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return; // if not a winning combo, continue on with code

    // CHECK VERTICALLY 
    winningCells = [cell];
    rowToCheck = rowIndex-1;
    // CHECK VERTICALLY TOP>DOWN
    colToCheck = colIndex;
    while (rowToCheck >= 0) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck--;
        } else {
            break;
        }
    }
    
    // CHECK VERTICALLY BOTTOM > UP
    rowToCheck = rowIndex + 1;
    while (rowToCheck <= 5) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck++;
        } else {
            break;
        }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return; //if not a winning combo, continue on with code


    // CHECK DIAGONALLY BOTTOM LEFT > TOP RIGHT / 
    winningCells = [cell];
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck <= 5) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck++;
            colToCheck--;
        } else {
            break;
        }
    }
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck >= 0) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck--;
            colToCheck++;
        } else {
            break;
        }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return; //if not a winning combo, continue on with code


    // CHECK DIAGONALLY BOTTOM RIGHT > TOP LEFT \ 
    winningCells = [cell];
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck >= 0) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck--;
            colToCheck--;
        } else {
            break;
        }
    }
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck <= 5) {
        const cellToCheck = rows[rowToCheck][colToCheck];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            rowToCheck++;
            colToCheck++;
        } else {
            break;
        }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return; //if not a winning combo, continue on with code

    // CHECK FOR TIE
    const rowsWithoutTop = rows.slice(0, 6);
    for (const row of rowsWithoutTop) {
        for (const cell of row) {
            const classList = getClassListArray(cell);
            if (!classList.includes("yellow") && !classList.includes("red")) {
                return;
            }
        }
    }
    gameIsLive = false;
    statusSpan.textContent = "Game is tied! Reset to Play Again."
};


///////////////////////////
////// EVENT HANDLERS 
///////////////////////////

// event.target to return div (cell) element when event occurs. see listener below. 
const handleCellMouseOver = (event) => {
    if (!gameIsLive) return;
    const cell = event.target; // provide access to the div element when event target is initialized
    const [rowIndex, colIndex] = getCellLocation(cell); // de-structure elements of array output 
    const topCell = topCells[colIndex];
    if (yellowIsNext === true) {
        topCell.classList.add("yellow");
    }else{
        topCell.classList.add("red");
    }
};

// remove class list red &/or yellow if exists
const handleCellMouseOut = (event) => {
    const cell = event.target; // provide access to the div element when event target is initialized
    const [rowIndex, colIndex] = getCellLocation(cell); // de-structure elements of array output 
    clearColorFromTopCell(colIndex);
}

const handleCellClick = (event) => {
    if (!gameIsLive) return;
    const cell = event.target; // provide access to the div element when event target is initialized
    const [rowIndex, colIndex] = getCellLocation(cell); // de-structure elements of array output 
    
    const openCell = getFirstOpenCellInColumn(colIndex);

    if (!openCell) return;

    if (yellowIsNext === true) {
        openCell.classList.add("yellow");
    }else{
        openCell.classList.add("red");
    }

    checkStatusOfGame(openCell);
    yellowIsNext = !yellowIsNext;
    clearColorFromTopCell(colIndex);
    
    if (gameIsLive) {
        const topCell = topCells[colIndex];
        if (yellowIsNext === true) {
            topCell.classList.add("yellow");
        }else{
            topCell.classList.add("red");
        }
    }
};

//////////////////////////
////// EVENT LISTENERS
//////////////////////////

// for of loops to loop over all cells & add event listeners to them
// when mouse moves over & away from any cell in DOM, appropriate handler function will fire
for (const row of rows) {
    for (const cell of row) {
        cell.addEventListener("mouseover", handleCellMouseOver);
        cell.addEventListener("mouseout", handleCellMouseOut);
        cell.addEventListener("click", handleCellClick);
    };
};

resetButton.addEventListener("click", () => {
    for (const row of rows) {
        for (const cell of row) {
            cell.classList.remove("red");
            cell.classList.remove("yellow");
            cell.classList.remove("win");    
        }
    }
    gameIsLive = true;
    yellowIsNext = true;
    statusSpan.textContent = "";
});
