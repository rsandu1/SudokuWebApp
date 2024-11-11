let solvedBoard = [];
let timerInterval;
let isPaused = false;
let elapsedSeconds = 0;
let activeCell = null; // Track the currently active cell

// Predetermined Sudoku puzzles for different difficulty levels
const puzzles = {
    easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    medium: [
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 9, 0, 0, 7, 0, 0, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0, 5, 0, 8, 0],
        [0, 7, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 6],
        [6, 0, 0, 0, 0, 0, 3, 7, 0],
        [0, 0, 0, 9, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0]
    ],
    hard: [
        [0, 0, 0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 9, 0, 8, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 0, 7, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0]
    ]
};

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}

// Start the timer
function startTimer() {
    isPaused = false;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            elapsedSeconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    isPaused = !isPaused;
    document.getElementById("pause-timer").textContent = isPaused ? "Resume Timer" : "Pause Timer";
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Create an empty Sudoku grid
function createEmptyGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';  
    for (let i = 0; i < 81; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.id = `cell-${i}`;
        input.addEventListener('focus', () => activeCell = input); // Track active cell on focus
        input.addEventListener('input', handleKeyboardInput); // Handle keyboard input
        grid.appendChild(input);
    }
}

// Load a new puzzle and start the timer
function generateNewPuzzle() {
    clearGrid();
    const difficulty = document.getElementById('difficulty').value;
    const puzzle = puzzles[difficulty];
    puzzle.flat().forEach((value, index) => {
        let cell = document.getElementById(`cell-${index}`);
        if (value !== 0) {
            cell.value = value;
            cell.disabled = true;
        } else {
            cell.value = '';
            cell.disabled = false;
        }
    });

    const board = puzzle.flat();
    solvedBoard = [...board];
    solve(solvedBoard);
    elapsedSeconds = 0;
    updateTimerDisplay();
    startTimer();
}

// Backtracking algorithm to solve the puzzle
function solve(board) {
    let emptySpot = findEmpty(board);
    if (!emptySpot) {
        return true;
    }

    let [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row * 9 + col] = num;

            if (solve(board)) {
                return true;
            }

            board[row * 9 + col] = 0;
        }
    }

    return false;
}

// Find the next empty cell (0) in the grid
function findEmpty(board) {
    for (let i = 0; i < 81; i++) {
        if (board[i] === 0) {
            return [Math.floor(i / 9), i % 9];
        }
    }
    return null;
}

// Check if it's safe to place a number in a given cell
function isSafe(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row * 9 + i] === num || board[i * 9 + col] === num) {
            return false;
        }
    }

    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[(boxRow + i) * 9 + (boxCol + j)] === num) {
                return false;
            }
        }
    }

    return true;
}

// Handle keyboard input
function handleKeyboardInput(event) {
    const input = event.target;
    const value = input.value;
    if (!/^[1-9]$/.test(value)) {
        input.value = '';
    }
}

// Handle button-based number input
function handleNumberButtonClick(value) {
    if (activeCell && !activeCell.disabled) {
        activeCell.value = value;
    }
}

// Check if the current puzzle input matches the solved board
function checkSolution() {
    for (let i = 0; i < 81; i++) {
        const userInput = document.getElementById(`cell-${i}`).value;
        if (userInput === '' || parseInt(userInput) !== solvedBoard[i]) {
            showPopup("Incorrect solution!");
            return;
        }
    }
    stopTimer();
    showPopup("Correct solution!");
}

// Show the popup with the result message
function showPopup(message) {
    const popup = document.getElementById('check-result-popup');
    const messageElement = document.getElementById('popup-message');
    messageElement.innerHTML = message;
    popup.style.display = "block";

    document.querySelector('.close').onclick = function() {
        popup.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    };
}

// Clear the grid
function clearGrid() {
    for (let i = 0; i < 81; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (!cell.disabled) {
            cell.value = '';
            // TODO: handle in database
        }
    }
}

// Initialize the game and add event listeners for buttons
window.onload = function() {
    createEmptyGrid();

    document.getElementById('new-puzzle').addEventListener('click', generateNewPuzzle);
    document.getElementById('check-solution').addEventListener('click', checkSolution);
    document.getElementById('pause-timer').addEventListener('click', pauseTimer);
    document.getElementById('clear-grid').addEventListener('click', clearGrid);

    document.querySelectorAll('.number-btn').forEach(button => {
        button.addEventListener('click', () => {
            handleNumberButtonClick(button.getAttribute('data-value'));
        });
    });

    generateNewPuzzle();
};

