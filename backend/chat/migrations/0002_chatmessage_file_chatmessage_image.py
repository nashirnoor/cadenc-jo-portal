# Generated by Django 5.0.7 on 2024-07-22 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatmessage',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='chat_files/'),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='chat_images/'),
        ),
    ]
