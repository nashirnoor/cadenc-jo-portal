# Generated by Django 5.0.6 on 2024-07-09 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_companyprofile_about'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='position',
            field=models.CharField(blank=True, max_length=255, verbose_name='Position'),
        ),
    ]
