# Generated by Django 4.1.3 on 2022-11-18 18:16

import authentication.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_user_researcher_user_student'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', authentication.models.UserManager()),
            ],
        ),
    ]
