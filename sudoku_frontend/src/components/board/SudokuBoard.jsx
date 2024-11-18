import React from 'react';
import PauseIcon from '@mui/icons-material/Pause';

import './SudokuBoard.css';
import { useSudoku } from '../../context/SudokuContext';

function SudokuBoard() {
    const { board, updateBoard, isPaused, setIsPaused } = useSudoku();
    const subGridSize = board.length;
    // Handle user input for an editable cell and update board
    const handleCellInput = (row, col, value) => {
        if (!isPaused && board[row][col].isEditable && !isNaN(value) && value >= 1 && value <= 9) {
            updateBoard(row, col, Number(value));
        }
    };

    // Event Handler for user actions
    const handleKeyDown = (event, row, col) => {
        if (!isPaused && board[row][col].isEditable) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                updateBoard(row, col, 0);
            } else if (!isNaN(event.key) && event.key >= 1 && event.key <= 9) {
                handleCellInput(row, col, event.key);
            }
        }
    };

    return (
        <div className= 'sudoku-overlay'>
            {isPaused && (
                <div className="pause-icon">
                    <PauseIcon style={{ fontSize: 80, color: '#000' }} />
                </div>
            )}

            <table className={`sudoku-board ${isPaused ? 'blur' : ''}`}>
                <tbody>
                    {board.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={subGridSize === 4 ? 'sub-row-2' : 'sub-row-3'}
                        >
                            {row.map((cell, colIndex) => (
                                <td
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`sudoku-cell ${cell.isEditable ? 'editable' : ''} ${subGridSize === 4 ? 'sub-cell-2' : 'sub-cell-3'
                                        }`}
                                    tabIndex="0"
                                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                >
                                    {cell.value === 0 || cell.value === -1 ? '' : cell.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SudokuBoard;