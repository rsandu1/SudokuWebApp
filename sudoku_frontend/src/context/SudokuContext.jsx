import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const SudokuContext = createContext();

export const SudokuProvider = ({ children }) => {
    const defaultBoard = Array.from({ length: 9 }, () => Array(9).fill(-1));
    const boardType = [[9, 25], [9, 45], [9, 60]]; // Board length + cells to fill
    const [currentCell, setCurrentCell] = useState({row: -1, col: -1})
    const [board, setBoard] = useState(defaultBoard);
    const [incorrectCells, setIncorrectCells] = useState([]);
    const [difficulty, setDifficulty] = useState(0);
    const [inNote, setInNote] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [timer, setTimer] = useState(0);
    const [curDifficulty, setCurDifficulty] = useState(0);
    const boardTypeText = ["9x9 25", "9x9 45", "9x9 60"];
    const [boardID, setBoardID] = useState(0);
    const [isSolved, setIsSolved] = useState(false);

    const getSpecificHint = () => {
        let current = board[currentCell.row][currentCell.col]
        console.log(current)
        if (inGame && !isPaused && current.isEditable) { 
            axios.post('/api/sudoku/specifichint', {board_id: boardID, row: currentCell.row, col: currentCell.col}
            )
                .then((response) => {
                    console.log(response)
                    if (response.data) {
                
                        const newBoard = board.map(r => [...r]);
                        newBoard[response.data.row][response.data.col].value = parseInt(response.data.value);
                        newBoard[response.data.row][response.data.col].isEditable = false; 
                        newBoard[response.data.row][response.data.col].isHint = true; 
                        updateBoard(response.data.row, response.data.col, parseInt(response.data.value))
                    } else {
                        throw new Error('Invalid response data');
                    }
                })
                .catch((error) => {
                    console.log('Error getting a random hint:', error);
                });
        }
    }

    const getHint = () => {
        if (inGame && !isPaused) {
            axios.post('/api/sudoku/hint', {board_id: boardID}
            )
                .then((response) => {
                    console.log(response)
                    if (response.data) {
                
                        const newBoard = board.map(r => [...r]);
                        newBoard[response.data.row][response.data.col].value = parseInt(response.data.value);
                        newBoard[response.data.row][response.data.col].isEditable = false; 
                        newBoard[response.data.row][response.data.col].isHint = true; 
                        updateBoard(response.data.row, response.data.col, parseInt(response.data.value))
                    } else {
                        throw new Error('Invalid response data');
                    }
                })
                .catch((error) => {
                    console.log('Error getting a random hint:', error);
                });
        }
    }


    // Convert the board string into a 2D array
    const parseBoard = (boardString) => {
        let size = boardType[difficulty][0];
        return Array.from({ length: size }, (_, rowIndex) =>
            Array.from({ length: size }, (_, colIndex) => ({
                value: Number(boardString[rowIndex * size + colIndex]),
                isEditable: boardString[rowIndex * size + colIndex] === '0', // Editable if the value is 0
                note: 0, 
                isHint: false
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
        if (inGame && !isPaused){
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
        if (inGame && !isPaused){
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

    const checkBoard = async () => {
        if (inGame && !isPaused) { 
            try {
                const response = await axios.post('/api/sudoku/check', { board_id: boardID });
                if (response.data) {
                    if (response.data.is_solved){
                        setIsSolved(true);
                        // setInGame(false);
                    }else if(Array.isArray(response.data.incorrectCells)){
                        setIncorrectCells(response.data.incorrectCells);
                    }
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Failed to check the board:', error);
            }
        }
    };

    return (
        <SudokuContext.Provider value={{
            board, boardID,
            updateBoard, 
            getSpecificHint,
            getHint,
            undo, redo, 
            difficulty, setDifficulty, startGame,
            inNote, setInNote,
            isPaused, setIsPaused,
            inGame, setInGame,
            isSolved, setIsSolved,
            timer, setTimer,
            boardTypeText,
            curDifficulty, setCurDifficulty,
            currentCell, setCurrentCell,
            checkBoard, incorrectCells
        }}>
            {children}
        </SudokuContext.Provider>
    );
};

// Custom hook to use the Sudoku context
export const useSudoku = () => useContext(SudokuContext);
