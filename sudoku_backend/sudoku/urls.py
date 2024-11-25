from django.urls import path
from sudoku.views.sudoku_board_views import SudokuBoardView
from sudoku.views.user_action_views import *


urlpatterns = [
    path('sudoku/board', SudokuBoardView.as_view(), name='sudoku-board'),
    path('sudoku/input', InputView.as_view(), name='sudoku-input'),
    path('sudoku/undo', UndoView.as_view(), name='sudoku-undo'),
    path('sudoku/check', CheckSudokuView.as_view(), name='sudoku-check'),
    path('sudoku/note', NoteView.as_view(), name='sudoku-note'),
    path('sudoku/hint', HintView.as_view(), name='sudoku-hint')
]