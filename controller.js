import * as model from './model.js';
import * as view from './view.js';

window.addEventListener("load", initializeMaze);

async function initializeMaze() {
    window.view = view;
    window.model = model;

    const mazeData = await fetchMazeData();
    const { rows, cols, maze, start } = mazeData;
    const mazeGrid = initializeGrid(rows, cols);
    const mazeStack = initializeStack();
    const decisionPointStack = initializeStack();

    createGrid(rows, cols);
    renderMaze(mazeData);
    populateMazeGrid(mazeGrid, maze);
    visitCell(mazeGrid, start, mazeData, mazeStack, decisionPointStack);

    mazeGrid.dump();
}

function populateMazeGrid(grid, maze) {
    maze.forEach((rowArray, row) => {
        rowArray.forEach((cellData, col) => {
            grid.set(row, col, cellData);
        });
    });
}

async function visitCell(mazeGrid, start, mazeData, mazeStack, decisionPointStack) {
    await model.visitCell(mazeGrid, start, mazeStack, mazeData, decisionPointStack);
    // renderMaze(mazeData);
}

function renderMaze(mazeData) {
    view.renderMaze(mazeData);
}

function createGrid(rows, cols) {
    view.createGrid(rows, cols);
}

async function fetchMazeData() {
    return await model.fetchMazeData();
}

function initializeGrid(rows, cols) {
    return model.initializeGrid(rows, cols);
}

function initializeStack() {
    return model.initializeStack();
}