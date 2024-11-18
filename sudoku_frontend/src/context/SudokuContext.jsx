import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';


const SudokuContext = createContext();

export const SudokuProvider = ({ children }) => {
    const defaultBoard = Array.from({ length: 9 }, () => Array(9).fill(-1));
    const boardType = [[9, 40], [9, 20], [4, 12]];

    const [board, setBoard] = useState(defaultBoard);
    const [history, setHistory] = useState([]);
    const [difficulty, setDifficulty] = useState('0');

    // Convert the passed in string into a 2D array
    const parseBoard = (boardString) => {
        let size = boardType[difficulty][0];
        return Array.from({ length: size }, (_, rowIndex) =>
            Array.from({ length: size }, (_, colIndex) => ({
                value: Number(boardString[rowIndex * size + colIndex]),
                isEditable: boardString[rowIndex * size + colIndex] === '0', // Editable if the value is 0
            })));
    };

    const startGame = () => {
        axios.post('http://127.0.0.1:8000/sudoku/board',
            {
                size: boardType[difficulty][0],
                num_remove: boardType[difficulty][1]
            }
        )
            .then((response) => {
                if (response.data && response.data.board) {
                    console.log('Game started successfully:', response.data);
                    const parsedBoard = parseBoard(response.data.board, );
                    setBoard(parsedBoard);
                    setHistory([]);
                    updateBoard();
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
        const newHistory = [...history, { row, col, prevValue: board[row][col].value }];
        setHistory(newHistory);

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
        if (history.length === 0) return;

        const lastChange = history.pop();
        setHistory([...history]); // Update history by removing the last entry

        const { row, col, prevValue } = lastChange;
        const newBoard = board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col
                    ? { ...cell, value: prevValue }
                    : cell
            )
        );
        setBoard(newBoard);
    };

    return (
        <SudokuContext.Provider value={{ board, updateBoard, undo, difficulty, setDifficulty, startGame }}>
            {children}
        </SudokuContext.Provider>
    );
};

// Custom hook to use the Sudoku context
export const useSudoku = () => useContext(SudokuContext);
