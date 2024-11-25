from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from sudoku.models import SudokuBoard, ActionHistory
import json

class InputViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Sudoku board for testing
        self.board = SudokuBoard.objects.create(
            board="123456789456789123789123456123456789456789123789123456123456789456789123789123456",
            solution="123456789456789123789123456123456789456789123789123456123456789456789123789123456",
            userBoard="000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        )
        self.url = "/sudoku/input"

    def test_valid_input(self):
        payload = {
            "board_id": self.board.board_id,
            "x": 0,
            "y": 0,
            "value": 5
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"detail": "Board updated successfully."})

        # Verify the userBoard is updated
        self.board.refresh_from_db()
        self.assertEqual(self.board.userBoard[0], "5")

        # Verify the ActionHistory is created
        action_history = ActionHistory.objects.get(sudoku_board=self.board)
        self.assertEqual(action_history.x, 0)
        self.assertEqual(action_history.y, 0)
        self.assertEqual(action_history.previous_value, 0)
        self.assertEqual(action_history.new_value, 5)

    def test_missing_parameters(self):
        payload = {
            "board_id": self.board.board_id,
            "x": 0  # Missing y and value
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_invalid_board_id(self):
        payload = {
            "board_id": 9999,  # Non-existent board ID
            "x": 0,
            "y": 0,
            "value": 5
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Board not found."})

    def test_invalid_coordinates(self):
        payload = {
            "board_id": self.board.board_id,
            "x": 10,  # Out of bounds
            "y": 0,
            "value": 5
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Invalid row or column index."})

    def test_invalid_value(self):
        payload = {
            "board_id": self.board.board_id,
            "x": 0,
            "y": 0,
            "value": 10  # Invalid value
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Value must be between 0 and 9."})