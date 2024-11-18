import React from 'react';
import './SudokuBoard.css';
import { useSudoku } from '../../context/SudokuContext';

function SudokuBoard() {
    const { board, updateBoard } = useSudoku();

    // Handle user input for an editable cell and update board
    const handleCellInput = (row, col, value) => {
        if (board[row][col].isEditable && !isNaN(value) && value >= 1 && value <= 9) {
            updateBoard(row, col, Number(value));
        }
    };

    // Event Handler for user actions
    const handleKeyDown = (event, row, col) => {
        if (board[row][col].isEditable) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                updateBoard(row, col, 0);
            } else if (!isNaN(event.key) && event.key >= 1 && event.key <= 9) {
                handleCellInput(row, col, event.key);
            }
        }
    };

    return (
        <div className="sudoku-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="sudoku-row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`sudoku-cell ${cell.isEditable ? 'editable' : ''}`}
                            tabIndex="0"
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        >
                            {cell.value === 0 || cell.value === -1 ? '' : cell.value}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default SudokuBoard;