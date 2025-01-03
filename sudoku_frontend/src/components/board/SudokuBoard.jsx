import React, {useEffect } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import './SudokuBoard.css';
import { useSudoku } from '../../context/SudokuContext';

function SudokuBoard() {
    const { board, updateBoard, isPaused, inGame, isSolved, setInGame, incorrectCells, setCurrentCell, currentCell, inNote} = useSudoku();

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

    const handleClick = (event, row, col) => {
        if (!isPaused) {
           setCurrentCell({row: row, col: col})
        }
    };

    const handleNoteDisplay = (cell) => {
        if (inNote && cell.notes && cell.notes.length > 0) {
            return (
                <div className="notes-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <div key={num} className="note-cell">
                            {cell.notes.includes(num) ? num : ''}
                        </div>
                    ))}
                </div>
            );
        }
        else if (cell.value && cell.value !== 0 && cell.value !== -1) { 
            return <span className="cell-value">{cell.value}</span>;
        }
        return '';
    };

    const isCellIncorrect = (row, col) => {
        return incorrectCells.some(cell => cell.row === row && cell.col === col);
    };

    // Handle message when game is solved
    const handleCloseDialog = () => {
        // setIsSolved(false);
        setInGame(false);
    };

    return (
        <div className='sudoku-overlay'>
        {isPaused && inGame && (
            <div className="pause-icon">
                <PauseIcon style={{ fontSize: 80, color: '#000' }} />
            </div>
        )}

        <table className={`sudoku-board ${isPaused && inGame ? 'blur' : ''}`}>
            <tbody className={`tbody ${isSolved ? 'solved' : ''}`}>
                {board.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={subGridSize === 4 ? 'sub-row-2' : 'sub-row-3'}
                    >
                        {row.map((cell, colIndex) => (
                            <td
                                key={`${rowIndex}-${colIndex}`}
                                className={`sudoku-cell 
                                    ${cell.isEditable ? 'editable' : ''} 
                                    ${cell.isHint ? 'hint' : ''} 
                                    ${subGridSize === 4 ? 'sub-cell-2' : 'sub-cell-3'} 
                                    ${inNote && cell.notes?.length > 0 ? 'sudoku-cell-note' : ''} 
                                    ${isCellIncorrect(rowIndex, colIndex) ? 'sudoku-cell-incorrect' : ''}`}
                                tabIndex="0"
                                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                onClick={(e) => handleClick(e, rowIndex, colIndex)}
                            >
                                {handleNoteDisplay(cell)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>

        <Dialog open={isSolved && inGame} onClose={handleCloseDialog}>
                <DialogTitle>Game Completed</DialogTitle>
                <DialogContent>
                    Congratulations! You have successfully completed the Sudoku puzzle.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
        </Dialog>
    </div>
    );
}

export default SudokuBoard;