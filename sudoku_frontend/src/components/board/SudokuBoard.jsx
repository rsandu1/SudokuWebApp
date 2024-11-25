import React from 'react';
import PauseIcon from '@mui/icons-material/Pause';

import './SudokuBoard.css';
import { useSudoku } from '../../context/SudokuContext';

function SudokuBoard() {
    const { board, updateBoard, isPaused, inGame } = useSudoku();
    const subGridSize = board.length;

    // Event Handler for user actions
    const handleKeyDown = (event, row, col) => {
        if (!isPaused && board[row][col].isEditable) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                updateBoard(row, col, 0);
            } else if (!isNaN(event.key) && event.key >= 1 && event.key <= 9) {
                updateBoard(row, col, Number(event.key));
            }
        }
    };

    return (
        <div className= 'sudoku-overlay'>
            {isPaused && inGame && (
                <div className="pause-icon">
                    <PauseIcon style={{ fontSize: 80, color: '#000' }} />
                </div>
            )}

            <table className={`sudoku-board ${isPaused && inGame ? 'blur' : ''}`}>
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