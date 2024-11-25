import random

def get_hint(board):
    board = board.board
    user_board = board.userBoard
    solution = board.solution

    combined_board = []
    
    for i in range(len(board)):
        if user_board[i] == '0':
            combined_board.append(board[i])
        else:
            combined_board.append(user_board[i])
            
    size = 9 if len(user_board) == 81 else 4
    indices = list(range(len(user_board)))
    random.shuffle(indices)
    
    hint_index = -1
    
    for i in indices:
        if(combined_board[i] != solution[i]):
            hint_index = i
            break
    
    if hint_index == -1:
        return None
    else:
        hint_x = int(hint_index / size)
        hint_y = int(hint_index % size)
        value = solution[hint_index]
        return hint_x, hint_y, value
    
    
    
    