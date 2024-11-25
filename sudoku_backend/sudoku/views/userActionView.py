from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from sudoku.models import SudokuBoard, ActionHistory, NoteHistory

"""
User Input
"""
class InputView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            x = request.data.get('x')
            y = request.data.get('y')
            new_value = request.data.get('value')
            board = SudokuBoard.objects.get(pk=id)
            board_size = 9 if len(board.userBoard) == 81 else 4

            if x is None or y is None or new_value is None:
                return Response({"detail": "Missing input parameters."}, status=status.HTTP_400_BAD_REQUEST)
            
            if not (0 <= x < 9 and 0 <= y < 9):
                return Response({"detail": "Invalid row or column index."}, status=status.HTTP_400_BAD_REQUEST)
            
            if not (0 <= new_value <= board_size):
                return Response({"detail": "Value must be between 0 and 9."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Remove all histories that were undone
            ActionHistory.objects.filter(sudoku_board=board, undone=True).delete()
        
            # Update user input board
            index = x * board_size + y
            previous_value = int(board.userBoard[index])
            user_board_array = list(board.userBoard)
            user_board_array[index] = str(new_value)
            board.userBoard = ''.join(user_board_array)
            board.save()
            
            ActionHistory.objects.create(
                sudoku_board=board,
                x=x,
                y=y,
                previous_value=previous_value,
                new_value=new_value
            )
            
            return Response({
                "detail": "Board updated successfully.",
            }, status=status.HTTP_200_OK)
            
        except SudokuBoard.DoesNotExist:
            return Response({"detail": "Board not found."}, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Undo API View
"""
class UndoView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            board = SudokuBoard.objects.get(pk=id)
            last_action = board.history.filter(
                undone=False).order_by('-timestamp').first()

            if not last_action:
                return Response({"detail": "No actions to undo."}, status=status.HTTP_400_BAD_REQUEST)

            # Update Userboard
            board_array = list(board.userBoard)
            board_size = 9 if len(board_array) == 81 else 4
            index = last_action.x * board_size + last_action.y
            board_array[index] = str(last_action.previous_value)
            board.userBoard = ''.join(board_array)
            board.save()
            # Set history as undone
            last_action.undone = True
            last_action.save()
            return Response({"detail": "Undo successful."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


"""
Redo API View
"""
class RedoView(APIView):
    def post(self,request):
        try:
            id = request.data.get('board_id')
            board = SudokuBoard.objects.get(pk=id)
            last_action = board.history.filter(
                undone=True).order_by('-timestamp').first()

            if not last_action:
                return Response({"detail": "No actions to undo."}, status=status.HTTP_400_BAD_REQUEST)

            board_array = list(board.userBoard)
            board_size = 9 if len(board_array) == 81 else 4
            index = last_action.x * board_size + last_action.y
            board_array[index] = str(last_action.previous_value)
            board.userBoard = ''.join(board_array)
            board.save()
            last_action.undone = False
            last_action.save()
            return Response({"detail": "Redo successful."}, status=status.HTTP_200_OK)


        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Check Sudoku Game API View
"""
class CheckSudokuView(APIView):
    pass

"""
Note API View
"""
class NoteView(APIView):
    pass

"""
Hint API View
"""
class HintView(APIView):
    pass