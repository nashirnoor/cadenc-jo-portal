# Generated by Django 5.0.7 on 2024-07-18 04:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='Email Address')),
                ('first_name', models.CharField(max_length=100, verbose_name='First Name')),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True, unique=True, verbose_name='Phone Number')),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_approved', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('last_login', models.DateTimeField(auto_now=True)),
                ('auth_provider', models.CharField(default='email', max_length=50)),
                ('user_type', models.CharField(choices=[('normal', 'Normal User'), ('recruiter', 'Recruiter')], default='normal', max_length=10)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Skill Name')),
            ],
        ),
        migrations.CreateModel(
            name='Recruiter',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('company_name', models.CharField(max_length=255, verbose_name='Company Name')),
            ],
            options={
                'verbose_name': 'Recruiter',
                'verbose_name_plural': 'Recruiters',
            },
            bases=('accounts.user',),
        ),
        migrations.CreateModel(
            name='OneTimePassword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=6, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='skills',
            field=models.ManyToManyField(blank=True, related_name='users', to='accounts.skill', verbose_name='Skills'),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(blank=True, max_length=255, verbose_name='Position')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='profile_photos/', verbose_name='Profile Photo')),
                ('resume', models.FileField(blank=True, null=True, upload_to='resumes/', verbose_name='Resume')),
                ('about', models.CharField(blank=True, max_length=800, verbose_name='about_user')),
                ('skills', models.ManyToManyField(blank=True, related_name='user_profiles', to='accounts.skill', verbose_name='Skills')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('employment_type', models.CharField(choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('self_employed', 'Self-Employed'), ('freelance', 'Freelance'), ('internship', 'Internship'), ('trainee', 'Trainee')], max_length=20, verbose_name='Employment Type')),
                ('location_type', models.CharField(choices=[('on_site', 'On-Site'), ('remote', 'Remote'), ('hybrid', 'Hybrid')], max_length=10, verbose_name='Location Type')),
                ('start_date', models.DateField(verbose_name='Start Date')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='End Date')),
                ('role', models.CharField(max_length=100, verbose_name='Role')),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_experiences', to='accounts.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('university', models.CharField(max_length=255, verbose_name='University')),
                ('degree', models.CharField(max_length=100, verbose_name='Degree')),
                ('field_of_study', models.CharField(max_length=100, verbose_name='Field of Study')),
                ('start_date', models.DateField(verbose_name='Start Date')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='End Date')),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='educations', to='accounts.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=255, verbose_name='Company Name')),
                ('about', models.CharField(blank=True, max_length=1000, verbose_name='About')),
                ('company_location', models.CharField(max_length=255, verbose_name='Company Location')),
                ('company_strength', models.CharField(max_length=255, verbose_name='Company Strength')),
                ('contact_number', models.CharField(max_length=15, verbose_name='Contact Number')),
                ('email_address', models.EmailField(max_length=255, verbose_name='Email Address')),
                ('company_logo', models.ImageField(blank=True, null=True, upload_to='company_logos/', verbose_name='Company Logo')),
                ('recruiter', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='company_profile', to='accounts.recruiter')),
            ],
            options={
                'verbose_name': 'Company Profile',
                'verbose_name_plural': 'Company Profiles',
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_title', models.CharField(max_length=255, verbose_name='Job Title')),
                ('job_type', models.CharField(choices=[('full_time', 'Full-time'), ('part_time', 'Part-time'), ('contract', 'Contract'), ('intern', 'Intern')], max_length=20, verbose_name='Job Type')),
                ('salary', models.CharField(max_length=255, verbose_name='Salary')),
                ('vacancies', models.PositiveIntegerField(verbose_name='No. of Vacancies')),
                ('experience', models.CharField(max_length=255, verbose_name='Experience')),
                ('job_location', models.CharField(max_length=255, verbose_name='Job Location')),
                ('job_description', models.TextField(verbose_name='Job Description')),
                ('core_responsibilities', models.TextField(verbose_name='Core Responsibilities')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('applications', models.JSONField(default=list)),
                ('deleted', models.BooleanField(default=False, verbose_name='Deleted')),
                ('job_location_type', models.CharField(choices=[('on_site', 'On-site'), ('hybrid', 'Hybrid'), ('remote', 'Remote')], default='on_site', max_length=20, verbose_name='Job Location Type')),
                ('recruiter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_posts', to=settings.AUTH_USER_MODEL)),
                ('skills', models.ManyToManyField(blank=True, related_name='user_jobs', to='accounts.skill', verbose_name='Skills')),
            ],
            options={
                'unique_together': {('recruiter', 'job_title')},
            },
        ),
    ]
