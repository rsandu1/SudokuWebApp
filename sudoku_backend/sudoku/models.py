from django.db import models
from django.utils.timezone import now


class sudokuBoard(models.Model):
    board_id = models.AutoField(primary_key=True)
    board = models.CharField(max_length=81)
    solution = models.CharField(max_length=81)
    user_input = models.CharField(max_length=81, blank=True, default="0" * 81)
    creation_time = models.DateField(default=now)
    
    class Meta:
        ordering = ['-creation_time']