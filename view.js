export function createGrid(rows, columns) {
    const table = document.querySelector(".grid-container");
    table.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            td.dataset.row = i;
            td.dataset.column = j;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

export function renderMaze(mazeData) {
    const { maze, start, goal } = mazeData;

    maze.forEach(rowArray => {
        rowArray.forEach(cell => {
            const { row, col, north, south, east, west, visited } = cell;
            const cellElement = document.querySelector(`td[data-row="${row}"][data-column="${col}"]`);
            cellElement.innerHTML = '';

            if (north) cellElement.classList.add("wallNorth");
            if (south) cellElement.classList.add("wallSouth");
            if (east) cellElement.classList.add("wallEast");
            if (west) cellElement.classList.add("wallWest");
            if (visited) {
                const dot = createDot();
                cellElement.appendChild(dot);
            }
            if (row === start.row && col === start.col) cellElement.classList.add("start");
            if (row === goal.row && col === goal.col) cellElement.classList.add("goal");
        });
    });
}

export function createDot() {
    const dot = document.createElement('div');
    dot.classList.add('visited');
    return dot;
}
