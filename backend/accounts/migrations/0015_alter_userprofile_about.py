# Generated by Django 5.0.6 on 2024-07-09 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_userprofile_about'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='about',
            field=models.CharField(blank=True, max_length=800, verbose_name='about_user'),
        ),
    ]
