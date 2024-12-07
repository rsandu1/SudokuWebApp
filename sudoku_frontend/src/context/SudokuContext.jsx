import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SudokuContext = createContext();

export const SudokuProvider = ({ children }) => {
    const defaultBoard = Array.from({ length: 9 }, () => Array(9).fill(-1));
    const boardType = [[9, 40], [9, 20], [4, 12]]; // Board length + cells to fill

    const [board, setBoard] = useState(defaultBoard);
    const [incorrectCells, setIncorrectCells] = useState([]);
    const [difficulty, setDifficulty] = useState(0);
    const [inNote, setInNote] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [timer, setTimer] = useState(0);
    const [curDifficulty, setCurDifficulty] = useState(0);
    const boardTypeText = ["9x9 40", "9x9 20", "4x4 12"];
    const [boardID, setBoardID] = useState(0);
    const [isSolved, setIsSolved] = useState(true);

    // Convert the board string into a 2D array
    const parseBoard = (boardString) => {
        let size = boardType[difficulty][0];
        return Array.from({ length: size }, (_, rowIndex) =>
            Array.from({ length: size }, (_, colIndex) => ({
                value: Number(boardString[rowIndex * size + colIndex]),
                isEditable: boardString[rowIndex * size + colIndex] === '0', // Editable if the value is 0
                note: 0
            })));
    };

    // Send request to generate a new game
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
                    setBoardID(response.data.board_id);
                    setIsSolved(false);
                    setIncorrectCells([]);
                } else {
                    throw new Error('Invalid response data');
                }
            })
            .catch((error) => {
                console.log('Error starting the game:', error);
            });
    }

    // Function to update the board and store information to server
    const updateBoard = async (row, col, newValue) => {
        if (inGame) {
            const endpoint = inNote ? '/api/sudoku/note' : '/api/sudoku/input';
            const payload = {
                board_id: boardID,
                row: row,
                col: col,
                value: newValue,
            };
            try {
                await axios.post(endpoint, payload);
                const newBoard = board.map((r, rowIndex) =>
                    r.map((cell, colIndex) =>
                        rowIndex === row && colIndex === col
                            ? inNote
                                ? { ...cell, note: newValue } // Update note if inNote is true
                                : { ...cell, value: newValue } // Update value otherwise
                            : cell
                    )
                );
                setBoard(newBoard);
                setIncorrectCells((prev) => prev.filter(cell => !(cell.row === row && cell.col === col)));
            }
            catch (error) {
                console.error('Failed to update the board on the server:', error);
            }
        }
    };

    // Function to undo the last change
    const undo = () => {
        if (inGame){
            axios.post('/api/sudoku/undo', {board_id: boardID}
            )
                .then((response) => {
                    const newBoard = board.map(r => [...r]);
                    newBoard[response.data.row][response.data.col].value = response.data.previous_value;
                    setBoard(newBoard);
                })
                .catch((error) => {
                    console.log('Error undoing:', error);
                });
        }
    };

    const redo = () => {
        if (inGame){
            axios.post('/api/sudoku/redo', {board_id: boardID}
            )
                .then((response) => {
                    const newBoard = board.map(r => [...r]);
                    console.log(response.data.new_value);
                    newBoard[response.data.row][response.data.col].value = response.data.new_value;
                    setBoard(newBoard);
                })
                .catch((error) => {
                    console.log('Error undoing:', error);
                });
        }
    };

    const getHint = () => {
        if (inGame) {
            // Gather all editable and empty cells
            const editableCells = [];
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    if (board[row][col].isEditable && board[row][col].value === -1) {
                        editableCells.push({ row, col });
                    }
                }
            }
    
            if (editableCells.length === 0) {
                console.log("No editable cells available for a hint.");
                return;
            }
    
            // Choose a random editable cell
            const randomCell = editableCells[Math.floor(Math.random() * editableCells.length)];
    
            // Fetch the correct value for the chosen cell (you may need a helper for this)
            const correctValue = calculateCorrectValue(board, randomCell.row, randomCell.col); // Assuming this helper exists
    
            if (correctValue !== null) {
                // Update the board with the hint
                const newBoard = [...board];
                newBoard[randomCell.row][randomCell.col] = {
                    ...newBoard[randomCell.row][randomCell.col],
                    value: correctValue,
                };
                setBoard(newBoard);
                console.log(`Hint applied to cell (${randomCell.row}, ${randomCell.col}): ${correctValue}`);
            } else {
                console.log("Could not determine the correct value for the hint.");
            }
        } else {
            console.log("Game is not active.");
        }
    };
    
    // Helper function to calculate the correct value for a cell based on Sudoku rules
    const calculateCorrectValue = (board, row, col) => {
        // Logic to determine the correct value, ensuring no conflicts in the row, column, or grid
        const possibleValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
        // Remove values already in the same row
        board[row].forEach(cell => possibleValues.delete(cell.value));
    
        // Remove values already in the same column
        board.forEach(row => possibleValues.delete(row[col].value));
    
        // Remove values already in the same 3x3 grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                possibleValues.delete(board[r][c].value);
            }
        }
    
        // Return a single possible value, or null if no value is valid
        return possibleValues.size === 1 ? [...possibleValues][0] : null;
    };
    

    const checkBoard = async () => {
        try {
            const response = await axios.post('/api/sudoku/check', { board_id: boardID });
            if (response.data) {
                if (response.data.isSolved){
                    setIsSolved(true);
                    setInGame(false);
                }else if(Array.isArray(response.data.incorrectCells)){
                    setIncorrectCells(response.data.incorrectCells);
                }
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Failed to check the board:', error);
        }
    };

    return (
        <SudokuContext.Provider value={{
            board, boardID,
            updateBoard, 
            undo, redo, 
            difficulty, setDifficulty, startGame,
            inNote, setInNote,
            isPaused, setIsPaused,
            inGame, setInGame,
            isSolved, setIsSolved,
            timer, setTimer,
            boardTypeText,
            curDifficulty, setCurDifficulty,
            checkBoard, incorrectCells
        }}>
            {children}
        </SudokuContext.Provider>
    );
};

// Custom hook to use the Sudoku context
export const useSudoku = () => useContext(SudokuContext);
