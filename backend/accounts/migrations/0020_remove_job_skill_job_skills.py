# Generated by Django 5.0.7 on 2024-07-14 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_remove_job_skills_job_skill'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='skill',
        ),
        migrations.AddField(
            model_name='job',
            name='skills',
            field=models.ManyToManyField(blank=True, related_name='user_jobs', to='accounts.skill', verbose_name='Skills'),
        ),
    ]
