import random
from sudoku.models import SudokuBoard
from sudoku.utils.algorithms import is_valid

# Backtracking algorithm to solve the sudoku board.
def solve_sudoku(board, size):
    for row in range(size):
        for col in range(size):
            if board[row][col] == 0:
                for num in range(1, size + 1):
                    if is_valid(board, row, col, num, size):
                        board[row][col] = num
                        if solve_sudoku(board, size):
                            return True
                        board[row][col] = 0
                return False
    return True

def generate_sudoku(size):
    board = [[0] * size for _ in range(size)]
    for i in range(size):
        num = random.randint(1, size)
        row, col = random.randint(0, size - 1), random.randint(0, size - 1)
        while not is_valid(board, row, col, num, size):
            num = random.randint(1, size)
        board[row][col] = num

    solve_sudoku(board, size)
    return board

def remove_numbers(board, size, num_remove):
    puzzle_board = [row[:] for row in board]
    for _ in range(num_remove):
        row, col = random.randint(0, size - 1), random.randint(0, size - 1)
        while puzzle_board[row][col] == 0:
            row, col = random.randint(0, size - 1), random.randint(0, size - 1)
        puzzle_board[row][col] = 0
    return puzzle_board

# Convert board array into string
def board_to_string(board):
    return ''.join(str(cell) for row in board for cell in row)

# Generate Sudoku board and solution, return and save to database
def generate_and_save_sudoku(size, num_remove):
    if size not in [4, 9]:
        raise ValueError("Invalid board size. Only 4x4 and 9x9 boards are supported.")
    
    completed_board = generate_sudoku(size)
    puzzle_board = remove_numbers(completed_board, size, num_remove)
    solution_str = board_to_string(completed_board)
    board_string = board_to_string(puzzle_board)
    user_board = '0' * (size ** 2)
    
    # Save board to database
    new_board = SudokuBoard.objects.create(
        board=board_string,
        solution=solution_str,
        userBoard = user_board
    )
    
    return new_board.board_id, board_string