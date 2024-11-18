# Generated by Django 5.1.3 on 2024-11-17 14:32

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='sudokuBoard',
            fields=[
                ('board_id', models.AutoField(primary_key=True, serialize=False)),
                ('board', models.CharField(max_length=81)),
                ('solution', models.CharField(max_length=81)),
                ('user_input', models.CharField(blank=True, default='000000000000000000000000000000000000000000000000000000000000000000000000000000000', max_length=81)),
                ('creation_time', models.DateField(default=django.utils.timezone.now)),
            ],
            options={
                'ordering': ['-creation_time'],
            },
        ),
    ]