"""
Given a num at [row][col], check if it's valid in board
"""
def is_valid(board, row, col, num, size):
    for i in range(size):
        if i != col and board[row][i] == num:
            return False
        if i != row and board[i][col] == num:
            return False
        
    subgrid_size = int(size ** 0.5)
    start_row, start_col = subgrid_size * (row // subgrid_size), subgrid_size * (col // subgrid_size)
    for i in range(subgrid_size):
        for j in range(subgrid_size):
            if (start_row + i != row or start_col + j != col) and board[start_row + i][start_col + j] == num:
                return False
    return True