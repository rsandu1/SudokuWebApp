from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sudoku.models import sudokuBoard
from sudoku.serializers import SudokuBoardSerializer
from sudoku.services.generator import generate_and_save_sudoku

class SudokuBoardView(APIView):
    """
    View to handle Sudoku board generation (POST) and fetching (GET).
    """

    def post(self, request):
        """
        POST: Generate a new Sudoku puzzle based on num_remove and size.
        """
        try:
            num_remove = int(request.data.get('num_remove'))
            size = int(request.data.get('size'))
            if size not in [4, 9]:
                return Response({"error": "Invalid size. Only 4x4 or 9x9 boards are supported."}, status=status.HTTP_400_BAD_REQUEST)
            puzzle = generate_and_save_sudoku(size, num_remove)

            return Response({
                "board": puzzle
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        GET: Fetch all Sudoku boards.
        """
        boards = sudokuBoard.objects.all()
        serializer = SudokuBoardSerializer(boards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
