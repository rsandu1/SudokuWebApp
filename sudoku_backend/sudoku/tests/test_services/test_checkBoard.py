from django.test import TestCase
from sudoku.models import SudokuBoard
from sudoku.services.check_board import checkBoard
import pdb

class CheckBoardTests(TestCase):
    def setUp(self):
        # Set up a common SudokuBoard instance for tests
        self.board_data = (
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
        self.solution_data = (
            "534678912"
            "672195348"
            "198342567"
            "859761423"
            "426853791"
            "713924856"
            "961537284"
            "287419635"
            "345286179"
        )
        self.sudoku_board = SudokuBoard.objects.create(
            board=self.board_data,
            solution=self.solution_data,
            userBoard="0" * 81
        )

    def test_valid_user_input(self):
        # User input that matches the solution
        self.sudoku_board.userBoard = self.solution_data
        self.sudoku_board.save()

        is_solved, invalid_entries = checkBoard(self.sudoku_board)
        self.assertTrue(is_solved)
        self.assertEqual(invalid_entries, [])

    def test_invalid_user_input(self):
        # User input with invalid entries
        invalid_user_board = (
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
        self.sudoku_board.userBoard = invalid_user_board
        self.sudoku_board.save()

        is_solved, invalid_entries = checkBoard(self.sudoku_board)
        self.assertFalse(is_solved)
        expected_invalid_entries = [{'row': 0, 'col': 2}, {'row': 0, 'col': 3}]
        print(invalid_entries)
        self.assertEqual(invalid_entries, expected_invalid_entries)

    def test_partial_user_input(self):
        # User input with invalid entries
        invalid_user_board = (
            "004600000" # Correct input
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
        )
        self.sudoku_board.userBoard = invalid_user_board
        self.sudoku_board.save()
        is_solved, invalid_entries = checkBoard(self.sudoku_board)
        print (invalid_entries)
        self.assertFalse(is_solved)
        self.assertEqual(invalid_entries, [])
