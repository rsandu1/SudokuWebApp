from django.apps import AppConfig
from django.utils.timezone import now, timedelta

class SudokuConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sudoku'
    
    # def ready(self):
    #     # Delete boards created more than 7 days from now
    #     from .models import sudokuBoard
    #     cutoff_date = now() - timedelta(days=7)
    #     sudokuBoard.objects.filter(creation_time__lt=cutoff_date).delete()

