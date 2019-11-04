import React from 'react';
import './Game.css';
import Cell from './Cell'
import {CELL_SIZE, WIDTH, HEIGHT} from './Constants'


class Game extends React.Component {

    constructor() {
        super();
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;

        this.board = this.makeEmptyBoard();
    }

    state = {
        cells: [],
        interval: 100,
    }

    makeEmptyBoard() {
        let board = [];
        for (let row = 0; row < this.rows; row++) {
            board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                board[row][col] = false;
            }
        }

        return board;
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    handleClick = (event) => {

        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }



    nextGeneration=() => {
        let newBoard = this.makeEmptyBoard();

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {

                let neighbours = this.calculateNeighbours(this.board, col, row);
                if (this.board[row][col]) {
                    if (neighbours === 2 || neighbours === 3) {
                        newBoard[row][col] = true;
                    } else {
                        newBoard[row][col] = false;
                    }
                } else {
                    if (!this.board[row][col] && neighbours === 3) {
                        newBoard[row][col] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
    }

    /**
     * Calculate the number of live neighbours at point (row, col)
     * @param {Array} board 
     * @param {int} col 
     * @param {int} row 
     */

    calculateNeighbours(board, col, row) {
        let neighbours = 0;
        const neighbourOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let index = 0; index < neighbourOffsets.length; index ++) {
            const offset = neighbourOffsets[index];
            let row1 = row + offset[0];
            let col1 = col + offset[1];

            /**
             * The following code block makes sures of the req:
             *   A Cell who "comes to life" outside the board should wrap at the other side of the board.
             *  
             * So, this code block considers the cell on the other side of the board as the current cell's neighbour
             * i.e the first cell and last cell of a row are neighbours. and similarly, first and last cell of current column are neighbourrs.
             * ** */
            if(col1 == this.cols) {
                col1 = 0;
            } 
            if(row1 == this.rows) {
                row1 = 0;
            }
            if(col1 == -1) {
                col1 = this.cols-1;
            }
            if(row1 == -1) {
                row1 = this.rows-1;
            }
            //increase in number of live neighbours
            if (col1 >= 0 && col1 < this.cols && row1 >= 0 && row1 < this.rows && board[row1][col1]) {
                neighbours++;
            }
        }

        return neighbours;
    }


    

    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
    }

    render() {
        const { cells } = this.state;
        return (
            <div>
                <div className="Board"
                    style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n; }}>

                    {cells.map(cell => (
                        <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
                    ))}
                </div>

                <div className="controls">
                    <button className="button" onClick={this.nextGeneration}>Next Generation</button>
                    <button className="button" onClick={this.handleClear}>Clear</button>
                </div>
            </div>
        );
    }
}


export default Game;