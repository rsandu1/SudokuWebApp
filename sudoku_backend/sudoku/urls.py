from django.urls import path
from sudoku.views.views import SudokuBoardView

urlpatterns = [
    path('sudoku/board', SudokuBoardView.as_view(), name='sudoku-board'),
]