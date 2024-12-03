from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(SudokuBoard)
admin.site.register(ActionHistory)
admin.site.register(NoteHistory)