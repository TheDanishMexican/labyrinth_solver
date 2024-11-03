import Grid from "./grid.js";
import Stack from "./stack.js";
import { renderMaze } from "./view.js";

export async function fetchMazeData() {
    const response = await fetch("./mazeInfo.json");
    return response.json();
}

export function initializeGrid(rows, cols) {
    return new Grid(rows, cols);
}

export function initializeStack() {
    return new Stack();
}

export async function visitCell(mazeGrid, start, routeStack, mazeData, decisionPointStack) {
    let currentCell = start;
    const goal = await getGoalCell();
    const strategy = ['north', 'south', 'west', 'east'];
    let lastCellWithMutiplePaths = null;

    while (currentCell) {
        const { row, col } = currentCell;
        const cellObj = readFromCell(mazeGrid, row, col);

        cellObj.visited = true;
        pushCellToStack(routeStack, cellObj);
        lastCellWithMutiplePaths = checkOpenPaths(decisionPointStack, routeStack, cellObj, strategy);
        //denne her skal kaldes i et interval på en eller anden måde
        renderMaze(mazeData);
        if (row === goal.row && col === goal.col) {
            console.log("Goal reached here: ", cellObj);
            return;
        }

        currentCell = dfsTraversal(routeStack, mazeGrid, mazeData, decisionPointStack, strategy);

    }



    return console.log('We hit a wall here: ', getTopOfStack(routeStack), ', the last cell with another open route is: ', decisionPointStack.peek());
};

export function readFromCell(mazeGrid, row, col) {
    return mazeGrid.get(row, col);
}

export function dfsTraversal(routeStack, mazeGrid, mazeData, decisionPointStack, strategy) {
    const currentCell = getTopOfStack(routeStack);
    const { row, col } = currentCell;
    const exploredDirections = new Set();

    for (const direction of strategy) {
        if (exploredDirections.has(direction)) { continue; }

        let nextRow = row;
        let nextCol = col;

        switch (direction) {
            case 'south':
                nextRow = row + 1;
                break;
            case 'north':
                nextRow = row - 1;
                break;
            case 'east':
                nextCol = col + 1;
                break;
            case 'west':
                nextCol = col - 1;
                break;
        }

        if (mazeGrid.checkRowColBoundsValidity(nextRow, nextCol) && !mazeData.maze[row][col][direction]) {
            const nextCell = readFromCell(mazeGrid, nextRow, nextCol);
            if (!nextCell.visited) {
                return { row: nextRow, col: nextCol };
            }
        }
    }


    if (!routeStack.isEmpty()) {

        routeStack.pop();


        if (!decisionPointStack.isEmpty()) {
            const lastDecisionPoint = decisionPointStack.pop();
            pushCellToStack(routeStack, lastDecisionPoint);

            // Re-attempt traversal from this decision point
            return dfsTraversal(routeStack, mazeGrid, mazeData, decisionPointStack, strategy);
        }
    }

    return null;
}

export function pushCellToStack(stack, cell) {
    stack.push(cell);
}

export async function getGoalCell() {
    const { goal } = await fetchMazeData();
    return goal;
}

export function getTopOfStack(stack) {
    return stack.peek();
}

export function oppositeDirection(direction) {
    switch (direction) {
        case 'south': return 'north';
        case 'north': return 'south';
        case 'east': return 'west';
        case 'west': return 'east';
    }
}

export function checkOpenPaths(decisionPointStack, routeStack, currentCell, strategy) {
    let openPaths = 0;
    const previousCell = getPreviousCell(routeStack);
    //hvis der ikke er nogen previous cells er der ikke nogen paths og derfor returner vi bare
    if (!previousCell) return;

    for (const direction of strategy) {
        let oppDirection = oppositeDirection(direction);

        if (!currentCell[direction]) {
            openPaths++;
            if (!previousCell[oppDirection]) {
                openPaths--;
            }
        }
    }

    if (openPaths > 1) {
        pushCellToStack(decisionPointStack, currentCell);
    }
}

export function getPreviousCell(routeStack) {
    //hvis size er under 2 så er der ikke nogen previous cell
    if (routeStack.getSize() < 2) return null;

    const currentCell = routeStack.pop();
    const previousCell = routeStack.peek();

    routeStack.push(currentCell);

    return previousCell;
}

