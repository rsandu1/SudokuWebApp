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
            "row": 0,
            "col": 0,
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
        self.assertEqual(action_history.row, 0)
        self.assertEqual(action_history.col, 0)
        self.assertEqual(action_history.previous_value, 0)
        self.assertEqual(action_history.new_value, 5)
        
    def test_valid_previous_inputs(self):
        payload1 = {
            "board_id": self.board.board_id,
            "row": 0,
            "col": 0,
            "value": 5
        }

        payload2 = {
            "board_id": self.board.board_id,
            "row": 0,
            "col": 0,
            "value": 9
        }

        # First input
        response1 = self.client.post(self.url, data=json.dumps(payload1), content_type="application/json")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data, {"detail": "Board updated successfully."})

        # Refresh board and verify the first input
        self.board.refresh_from_db()
        self.assertEqual(self.board.userBoard[0], "5")

        # Second input
        response2 = self.client.post(self.url, data=json.dumps(payload2), content_type="application/json")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data, {"detail": "Board updated successfully."})

        self.board.refresh_from_db()
        self.assertEqual(self.board.userBoard[0], "9")

        # Verify the ActionHistory entries are created correctly
        action_histories = ActionHistory.objects.filter(sudoku_board=self.board).order_by('timestamp')
        self.assertEqual(action_histories.count(), 2)
        print(action_histories)

        # Validate the details of each ActionHistory entry
        self.assertEqual(action_histories[0].row, 0)
        self.assertEqual(action_histories[0].col, 0)
        self.assertEqual(action_histories[0].previous_value, 0)  # Assuming initial board value is 0
        self.assertEqual(action_histories[0].new_value, 5)

        self.assertEqual(action_histories[1].row, 0)
        self.assertEqual(action_histories[1].col, 0)
        self.assertEqual(action_histories[1].previous_value, 5)  # Assuming initial board value is 0
        self.assertEqual(action_histories[1].new_value, 9)

    def test_valid_2_inputs(self):
        payload1 = {
            "board_id": self.board.board_id,
            "row": 0,
            "col": 0,
            "value": 5
        }

        payload2 = {
            "board_id": self.board.board_id,
            "row": 0,
            "col": 1,
            "value": 9
        }

        # First input
        response1 = self.client.post(self.url, data=json.dumps(payload1), content_type="application/json")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data, {"detail": "Board updated successfully."})

        # Refresh board and verify the first input
        self.board.refresh_from_db()
        self.assertEqual(self.board.userBoard[0], "5")

        # Second input
        response2 = self.client.post(self.url, data=json.dumps(payload2), content_type="application/json")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data, {"detail": "Board updated successfully."})

        self.board.refresh_from_db()
        self.assertEqual(self.board.userBoard[1], "9")

        # Verify the ActionHistory entries are created correctly
        action_histories = ActionHistory.objects.filter(sudoku_board=self.board).order_by('timestamp')
        self.assertEqual(action_histories.count(), 2)

        # Validate the details of each ActionHistory entry
        self.assertEqual(action_histories[0].row, 0)
        self.assertEqual(action_histories[0].col, 0)
        self.assertEqual(action_histories[0].previous_value, 0)  # Assuming initial board value is 0
        self.assertEqual(action_histories[0].new_value, 5)

        self.assertEqual(action_histories[1].row, 0)
        self.assertEqual(action_histories[1].col, 1)
        self.assertEqual(action_histories[1].previous_value, 0)  # Assuming initial board value is 0
        self.assertEqual(action_histories[1].new_value, 9)
    
    def test_missing_parameters(self):
        payload = {
            "board_id": self.board.board_id,
            "row": 0  # Missing col and value
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_invalid_board_id(self):
        payload = {
            "board_id": 9999,  # Non-existent board ID
            "row": 0,
            "col": 0,
            "value": 5
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Board not found."})

    def test_invalid_coordinates(self):
        payload = {
            "board_id": self.board.board_id,
            "row": 10,  # Out of bounds
            "col": 0,
            "value": 5
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Invalid row or column index."})

    def test_invalid_value(self):
        payload = {
            "board_id": self.board.board_id,
            "row": 0,
            "col": 0,
            "value": 10  # Invalid value
        }

        response = self.client.post(self.url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Value must be between 0 and 9."})