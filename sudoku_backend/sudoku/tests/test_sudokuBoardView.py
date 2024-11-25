from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from sudoku.models import SudokuBoard

class SudokuBoardViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('sudoku-board')  # Name of the path in urls.py

    def test_post_valid_9x9_board(self):
        """Test creating a valid 9x9 Sudoku board."""
        payload = {
            "size": 9,
            "num_remove": 40
        }
        response = self.client.post(self.url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("board_id", response.data)
        self.assertIn("board", response.data)
        self.assertEqual(len(response.data["board"]), 81)

    def test_post_valid_4x4_board(self):
        """Test creating a valid 4x4 Sudoku board."""
        payload = {
            "size": 4,
            "num_remove": 5
        }
        response = self.client.post(self.url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("board_id", response.data)
        self.assertIn("board", response.data)
        self.assertEqual(len(response.data["board"]), 16) 

    def test_post_invalid_size(self):
        """Test creating a board with an invalid size."""
        payload = {
            "size": 5, 
            "num_remove": 10
        }
        response = self.client.post(self.url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid size. Only 4x4 or 9x9 boards are supported."})

    def test_post_missing_parameters(self):
        """Test creating a board with missing parameters."""
        payload = {
            "size": 9
        }
        response = self.client.post(self.url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_post_invalid_parameters(self):
        """Test creating a board with invalid parameters."""
        payload = {
            "size": "invalid",
            "num_remove": "invalid"
        }
        response = self.client.post(self.url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
