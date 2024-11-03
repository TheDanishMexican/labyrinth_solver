export default class Grid {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
    }

    dump() {
        console.table(this.grid);
    }

    normalizeInput(row, column) {
        if (arguments.length === 1 && typeof row === 'object' && row != null) {
            const { row: r, column: c } = row;
            return { row: r, column: c };
        } else if (arguments.length === 2) {
            return { row, column };
        }
    }

    checkRowColBoundsValidity(row, column) {
        if (row >= this.rows || row < 0) return false;
        if (column >= this.columns || column < 0) return false;
        return true;
    }

    set(row, column, value) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (!this.checkRowColBoundsValidity(r, c)) return undefined;

        this.grid[r][c] = value;
    }

    get(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (!this.checkRowColBoundsValidity(r, c)) return undefined;

        return this.grid[r][c];
    }

    indexFor(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (!this.checkRowColBoundsValidity(r, c)) return undefined;

        const index = (r * this.columns) + c;

        return index;
    }

    rowColFor(index) {
        if (index < 0 || index > this.rows * this.columns) {
            return -1;
        }

        const row = Math.floor(index / this.columns);
        const column = index % this.columns;

        return { row, column };
    }

    neighbours(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        const neighboursList = [];

        for (const [dx, dy] of directions) {
            const newRow = r + dx;
            const newColumn = c + dy;

            if (this.checkRowColBoundsValidity(newRow, newColumn)) {
                const index = this.indexFor(newRow, newColumn);
                const rowAndCol = this.rowColFor(index);

                neighboursList.push(rowAndCol);
            }
        }

        return neighboursList;
    }

    neighbourValues(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        const neighboursList = [];

        for (const [dx, dy] of directions) {
            const newRow = r + dx;
            const newColumn = c + dy;

            if (this.checkRowColBoundsValidity(newRow, newColumn)) {
                neighboursList.push({
                    row: newRow,
                    column: newColumn,
                    value: this.grid[newRow][newColumn]
                });
            }
        }

        return neighboursList;
    }

    nextInRow(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (c + 1 < this.columns) {
            return { row: r, column: c + 1, value: this.grid[r][c + 1] };
        } else return undefined;
    }

    nextInColumn(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (r + 1 < this.rows) {
            return { row: r + 1, column: c, value: this.grid[r + 1][c] };
        } else return undefined;
    }

    north(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);

        if (!this.checkRowColBoundsValidity(r - 1, c)) {
            return undefined;
        } else return { row: r - 1, column: c, value: this.grid[r - 1][c] };
    }

    south(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);
        if (!this.checkRowColBoundsValidity(r + 1, c)) {
            return undefined;
        } else {
            return { row: r + 1, column: c, value: this.grid[r + 1][c] };
        }
    }

    west(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);
        if (!this.checkRowColBoundsValidity(r, c - 1)) {
            return undefined;
        } else {
            return { row: r, column: c - 1, value: this.grid[r][c - 1] };
        }
    }

    east(row, column) {
        const { row: r, column: c } = this.normalizeInput(row, column);
        if (!this.checkRowColBoundsValidity(r, c + 1)) {
            return undefined;
        } else {
            return { row: r, column: c + 1, value: this.grid[r][c + 1] };
        }
    }

    rows() {
        return this.rows;
    }

    columns() {
        return this.columns;
    }

    size() {
        return this.rows * this.columns;
    }

    fill(value) {
        this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(value));
    }

}
