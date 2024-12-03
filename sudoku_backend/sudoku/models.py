from django.db import models
from django.utils.timezone import now

class SudokuBoard(models.Model):
    board_id = models.AutoField(primary_key=True)
    board = models.CharField(max_length=81)
    solution = models.CharField(max_length=81)
    userBoard = models.CharField(max_length=81, null=True, blank=True)
    creation_time = models.DateField(default=now)
    
    class Meta:
        ordering = ['-creation_time']
        
class ActionHistory(models.Model):
    # 1-1 relationship with board, delete all history when board is deleted
    sudoku_board = models.ForeignKey(
        SudokuBoard, 
        on_delete=models.CASCADE, 
        related_name='history',
    )
    row = models.PositiveBigIntegerField()
    col = models.PositiveBigIntegerField()
    previous_value = models.IntegerField()
    new_value = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    undone = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['timestamp']
        
class NoteHistory(models.Model):
    sudoku_board = models.ForeignKey(
        SudokuBoard, 
        on_delete=models.CASCADE, 
        related_name='note',
    )
    row = models.PositiveBigIntegerField()
    col = models.PositiveBigIntegerField()
    value = models.IntegerField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['row', 'col'],
                name='unique_note_per_position'
            )
        ]