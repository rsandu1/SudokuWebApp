from rest_framework.test import APITestCase
from rest_framework import status
from sudoku.models import SudokuBoard
from sudoku.services.check_board import checkBoard
from sudoku.utils.algorithms import is_valid

class CheckSudokuViewTests(APITestCase):
    def setUp(self):
        # Create a sample Sudoku board for testing
        self.sudoku_board = SudokuBoard.objects.create(
            board=(
            "530070000"
            "600195000"
            "098000060"
            "800060003"
            "400803001"
            "700020006"
            "060000280"
            "000419005"
            "000080079"
        ),
            solution=(
            "534678912"
            "672195348"
            "198342567"
            "859761423"
            "426853791"
            "713924856"
            "961537284"
            "287419635"
            "345286179"
        ),
            userBoard=(
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"),
        )
        self.url = '/sudoku/check'

    def test_check_solved_board(self):
        """Test a correctly solved Sudoku board."""
        self.sudoku_board.userBoard = self.sudoku_board.solution
        self.sudoku_board.save()

        response = self.client.post(self.url, {"board_id": self.sudoku_board.pk}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_solved"], True)
        self.assertEqual(response.data["incorrectCells"], [])
        self.assertEqual(response.data["detail"], "Checked board successful.")

    def test_check_valid_board(self):
        """Test a Sudoku board with incorrect entries."""
        self.sudoku_board.userBoard = (
            "001000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000")
        self.sudoku_board.save()

        response = self.client.post(self.url, {"board_id": self.sudoku_board.pk}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_solved"], False)
        self.assertEqual(len(response.data["incorrectCells"]), 0)
        self.assertEqual(response.data["incorrectCells"], [])
        self.assertEqual(response.data["detail"], "Checked board successful.")
        
    def test_check_incorrect_board(self):
        """Test a Sudoku board with incorrect entries."""
        self.sudoku_board.userBoard = (
            "001100000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000"
            "000000000")
        self.sudoku_board.save()

        response = self.client.post(self.url, {"board_id": self.sudoku_board.pk}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_solved"], False)
        self.assertEqual(len(response.data["incorrectCells"]), 2)
        expected_incorrect_entries = [{'row': 0, 'col': 2}, {'row': 0, 'col': 3}]
        self.assertEqual(response.data["incorrectCells"], expected_incorrect_entries)
        self.assertEqual(response.data["detail"], "Checked board successful.")