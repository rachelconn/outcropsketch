# Generated by Django 4.1.3 on 2023-02-05 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_alter_user_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='instructor',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='researcher',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='student',
            field=models.BooleanField(),
        ),
    ]