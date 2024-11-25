from django.test import TestCase
from sudoku.utils.algorithms import is_valid
from sudoku.services.checkBoard import checkBoard 

class CheckBoardTests(TestCase):
    def test_valid_user_input(self):
        board = (
            "530070000"
            "600195000"
            "098000060"
            "800060003"
            "400803001"
            "700020006"
            "060000280"
            "000419005"
            "000080079"
        )
        user_board = (
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
        )
        result = checkBoard(board, user_board)
        self.assertEqual(result, [])

    def test_invalid_user_input(self):
        board = (
            "530070000"
            "600195000"
            "098000060"
            "800060003"
            "400803001"
            "700020006"
            "060000280"
            "000419005"
            "000080079"
        )
        user_board = (
            "001100000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
        )
        result = checkBoard(board, user_board)
        expected = [{'row': 0, 'col': 2, 'value': '1'}, {'row': 0, 'col': 3, 'value': '1'}]
        self.assertEqual(result, expected)