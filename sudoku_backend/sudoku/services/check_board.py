from sudoku.utils.algorithms import is_valid

def checkBoard(board):
    sudoku_board = board.board
    user_board = board.userBoard
    solution = board.solution
    
    invalid_entries = []
    size = 9 if len(user_board) == 81 else 4
    
    is_solved = True
    
    # Combine empty board with user entries
    combined_board = [
        user_board[i] if user_board[i] != '0' else sudoku_board[i]
        for i in range(len(sudoku_board))
    ]
    
    for i in range(len(sudoku_board)):
        if combined_board[i] != solution[i]:
            is_solved = False
    
    # No need to check if all valid
    if is_solved:
        return is_solved, invalid_entries

    user_board_2d = [combined_board[i * size:(i + 1) * size] for i in range(size)]
    # Validate each entry
    for row in range(size):
        for col in range(size):
            num = user_board_2d[row][col]
            if num != '0' and num != sudoku_board[(row)*size + col]:  # Only validate non-empty cells
                if not is_valid(user_board_2d, row, col, num, size):
                    invalid_entries.append({
                        "row": row,
                        "col": col
                    })
                    
    return is_solved, invalid_entries