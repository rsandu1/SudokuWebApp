import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SudokuContext = createContext();

export const SudokuProvider = ({ children }) => {
    const defaultBoard = Array.from({ length: 9 }, () => Array(9).fill(-1));
    const boardType = [[9, 40], [9, 20], [4, 12]]; // Board length + cells to fill

    const [board, setBoard] = useState(defaultBoard);
    const [difficulty, setDifficulty] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [timer, setTimer] = useState(0);
    const [curDifficulty, setCurDifficulty] = useState(0);
    const boardTypeText = ["9x9 40", "9x9 20", "4x4 12"];
    const [boardID, setBoardID] = useState(0)

    // Convert the board string into a 2D array
    const parseBoard = (boardString) => {
        let size = boardType[difficulty][0];
        return Array.from({ length: size }, (_, rowIndex) =>
            Array.from({ length: size }, (_, colIndex) => ({
                value: Number(boardString[rowIndex * size + colIndex]),
                isEditable: boardString[rowIndex * size + colIndex] === '0', // Editable if the value is 0
            })));
    };

    // [GET] Request, send board type and render
    const startGame = () => {
        axios.post('/api/sudoku/board',
            {
                size: boardType[difficulty][0],
                num_remove: boardType[difficulty][1]
            }
        )
            .then((response) => {
                if (response.data && response.data.board) {
                    const parsedBoard = parseBoard(response.data.board);
                    setBoard(parsedBoard);
                    setBoardID(response.data.board_id)
                } else {
                    throw new Error('Invalid response data');
                }
            })
            .catch((error) => {
                console.log('Error starting the game:', error);
            });
    }

    // Function to update the board and store its history
    const updateBoard = (row, col, newValue) => {
        const newBoard = board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col
                    ? { ...cell, value: newValue }
                    : cell
            )
        );
        setBoard(newBoard);
    };

    // Function to undo the last change
    const undo = () => {
    };

    return (
        <SudokuContext.Provider value={{
            board, boardID,
            updateBoard, undo, 
            difficulty, setDifficulty, startGame, 
            isPaused, setIsPaused,
            inGame, setInGame,
            timer, setTimer,
            boardTypeText,
            curDifficulty, setCurDifficulty
        }}>
            {children}
        </SudokuContext.Provider>
    );
};

// Custom hook to use the Sudoku context
export const useSudoku = () => useContext(SudokuContext);
