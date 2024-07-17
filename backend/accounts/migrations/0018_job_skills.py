# Generated by Django 5.0.7 on 2024-07-13 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0017_job_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='skills',
            field=models.ManyToManyField(blank=True, related_name='jobs', to='accounts.skill'),
        ),
    ]
