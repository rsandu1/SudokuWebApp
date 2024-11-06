let solvedBoard = []; // Global variable to store the solved board
let timerInterval;    // Timer interval ID for control
let isPaused = false; // Track if the timer is paused
let elapsedSeconds = 0; // Store elapsed time for resuming

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
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(() => {
        if (!isPaused) {
            elapsedSeconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    isPaused = !isPaused; // Toggle pause state
    document.getElementById("pause-timer").textContent = isPaused ? "Resume Timer" : "Pause Timer";
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Create an empty Sudoku grid
function createEmptyGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';  // Clear the grid before populating
    for (let i = 0; i < 81; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1'; // Only allow single-digit input
        input.id = `cell-${i}`;
        grid.appendChild(input);
    }
}

// Load a predetermined Sudoku puzzle based on difficulty
function generateNewPuzzle() {
    clearGrid();

    const difficulty = document.getElementById('difficulty').value;
    const puzzle = puzzles[difficulty];

    // Display the puzzle on the grid
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

    // Store the solution by solving the puzzle before any input is taken
    const board = puzzle.flat(); // Flatten the puzzle to a 1D array
    solvedBoard = [...board];    // Copy the puzzle into solvedBoard
    solve(solvedBoard);          // Solve the board using backtracking

    // Reset and start the timer
    elapsedSeconds = 0;
    updateTimerDisplay();
    startTimer();
}

// Backtracking algorithm to solve the puzzle
function solve(board) {
    let emptySpot = findEmpty(board);
    if (!emptySpot) {
        return true; // Solved
    }

    let [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row * 9 + col] = num;

            if (solve(board)) {
                return true;
            }

            board[row * 9 + col] = 0; // reset on backtrack
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

// Check if the current puzzle input matches the solved board stored earlier
function checkSolution() {
    for (let i = 0; i < 81; i++) {
        const userInput = document.getElementById(`cell-${i}`).value;
        if (userInput === '' || parseInt(userInput) !== solvedBoard[i]) {
            showPopup("Incorrect solution!");
            return;
        }
    }
    stopTimer(); // Stop the timer if the solution is correct
    showPopup("Correct solution!");
}

// Show the popup with the result message
function showPopup(message) {
    const popup = document.getElementById('check-result-popup');
    const messageElement = document.getElementById('popup-message');
    messageElement.innerHTML = message;
    popup.style.display = "block";

    // Close the popup when the close button is clicked
    document.querySelector('.close').onclick = function() {
        popup.style.display = "none";
    };

    // Close the popup when clicking anywhere outside of the popup content
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
        if (cell) {
            cell.value = '';
            cell.disabled = false;
        }
    }
}

// Initialize the game and add event listeners for the buttons
window.onload = function() {
    console.log("window.onload called"); // Debugging log
    createEmptyGrid();

    // Event listener for "New Puzzle" button
    document.getElementById('new-puzzle').addEventListener('click', generateNewPuzzle);

    // Event listener for "Check Solution" button
    document.getElementById('check-solution').addEventListener('click', checkSolution);

    // Event listener for "Pause Timer" button
    document.getElementById('pause-timer').addEventListener('click', pauseTimer);

    // Event listener for "Clear" button
    document.getElementById('clear-grid').addEventListener('click', clearGrid);

    // Automatically generate a new puzzle on page load
    generateNewPuzzle();
};
