from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from sudoku.models import SudokuBoard, ActionHistory, NoteHistory
from sudoku.services.check_board import checkBoard
from sudoku.services.get_hint import get_hint, get_specific_hint

"""
User Input
"""
class InputView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            row = request.data.get('row')
            col = request.data.get('col')
            new_value = request.data.get('value')
            board = SudokuBoard.objects.get(pk=id)
            board_size = 9 if len(board.userBoard) == 81 else 4

            if row is None or col is None or new_value is None:
                return Response({"detail": "Missing input parameters."}, status=status.HTTP_400_BAD_REQUEST)

            if not (0 <= row < 9 and 0 <= col < 9):
                return Response({"detail": "Invalid row or column index."}, status=status.HTTP_400_BAD_REQUEST)

            if not (0 <= new_value <= board_size):
                return Response({"detail": "Value must be between 0 and 9."}, status=status.HTTP_400_BAD_REQUEST)

            # Remove all histories that were undone
            ActionHistory.objects.filter(
                sudoku_board=board, undone=True).delete()

            # Update user input board
            index = row * board_size + col
            previous_value = int(board.userBoard[index])
            user_board_array = list(board.userBoard)
            user_board_array[index] = str(new_value)
            board.userBoard = ''.join(user_board_array)
            board.save()

            ActionHistory.objects.create(
                sudoku_board=board,
                row=row,
                col=col,
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
            index = last_action.row * board_size + last_action.col
            board_array[index] = str(last_action.previous_value)
            board.userBoard = ''.join(board_array)
            board.save()
            # Set history as undone
            last_action.undone = True
            last_action.save()
            return Response({"detail": "Undo successful.",
                            "row": last_action.row,
                            "col": last_action.col,
                            "previous_value": last_action.previous_value
                             }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Redo API View
"""
class RedoView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            board = SudokuBoard.objects.get(pk=id)
            last_action = board.history.filter(
                undone=True).order_by('timestamp').first()
            if not last_action:
                return Response({"detail": "No actions to redo."}, status=status.HTTP_400_BAD_REQUEST)

            board_array = list(board.userBoard)
            board_size = 9 if len(board_array) == 81 else 4
            index = last_action.row * board_size + last_action.col
            board_array[index] = str(last_action.new_value)
            board.userBoard = ''.join(board_array)
            board.save()
            last_action.undone = False
            last_action.save()
            return Response({"detail": "Redo successful.",
                            "row": last_action.row,
                            "col": last_action.col,
                            "new_value": last_action.new_value}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Check Sudoku Game API View
"""
class CheckSudokuView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            board = SudokuBoard.objects.get(pk=id)
            isSolved, incorrectCells = checkBoard(board)
            
            return Response({
                "detail": "Checked board successful.",
                "is_solved": isSolved,
                "incorrectCells": incorrectCells
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Note API View
"""
class NoteView(APIView):    
    def post(self, request):
        try:
            id = request.data.get('board_id')
            row = request.data.get('row')
            col = request.data.get('col')
            value = request.data.get('value')
            
            if not all([id, row, col]):
                return Response(
                    {"detail": "Missing parameters."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            board = SudokuBoard.objects.get(pk=id)
            note, created = NoteHistory.objects.get_or_create(
                sudoku_board=board,
                row=row,
                col=col,
                defaults={'notes': ''}
            )

            if value == 0:  # Handle deletion
                if note.notes:  # If there are notes
                    current_notes = list(map(int, note.notes))
                    if current_notes:  # Remove the last added note
                        current_notes.pop()
                        note.notes = ''.join(map(str, current_notes))
                        note.save()
                        if not note.notes:  # If no notes left, delete the record
                            note.delete()
            else:
                # Convert notes to list of integers
                current_notes = list(map(int, note.notes)) if note.notes else []
                
                if value not in current_notes:  # Only add if not already present
                    current_notes.append(value)
                    current_notes.sort()  # Keep notes sorted
                    note.notes = ''.join(map(str, current_notes))
                    note.save()

            return Response(
                {
                    "detail": "Note updated successfully.",
                    "notes": note.notes if note.notes else ''
                },
                status=status.HTTP_200_OK
            )

        except SudokuBoard.DoesNotExist:
            return Response(
                {"detail": "SudokuBoard not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
Hint API View
"""
class HintView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            board = SudokuBoard.objects.get(pk=id)
            hint = get_hint(board)
            
            # No hint available
            if hint is None:
                return Response(
                {"detail": "No hints available."},
                status=status.HTTP_200_OK)
            
            hint_row, hint_col, value = hint
            return Response(
                {"row": hint_row, "col": hint_col, "value": value},
                status=status.HTTP_200_OK
            )
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
"""
Specific Hint API View
"""
class SpecificHintView(APIView):
    def post(self, request):
        try:
            id = request.data.get('board_id')
            row = request.data.get('row')
            col = request.data.get('col')
            board = SudokuBoard.objects.get(pk=id)
            hint = get_specific_hint(board, row, col)
            
            # No hint available
            if hint is None:
                return Response(
                {"detail": "No hints available."},
                status=status.HTTP_200_OK)
            
            hint_row, hint_col, value = hint
            return Response(
                {"row": hint_row, "col": hint_col, "value": value},
                status=status.HTTP_200_OK
            )
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

"""
Retrieve Sudoku
"""
class RetrieveView(APIView):
   def get(self, request, board_id):
        """
        GET: Fetch Sudoku board given id.
        """
        try: 
            print(board_id)
            board = SudokuBoard.objects.get(board_id=board_id)
            return Response({"board": board.board,
                             "user_board": board.userBoard}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)