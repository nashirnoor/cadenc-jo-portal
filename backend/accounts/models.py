from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .manager import UserManager
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
from django.utils import timezone
from datetime import timedelta
# Create your models here.


AUTH_PROVIDERS = {'email':'email', 'google':'google'}


class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPES = (
        ('normal', 'Normal User'),
        ('recruiter', 'Recruiter'),
    )

    email = models.EmailField(max_length=255, unique=True, verbose_name=_("Email Address"))
    first_name = models.CharField(max_length=100, verbose_name=_("First Name"))
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True, verbose_name=_("Phone Number"))
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=50, default="email")
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='normal')

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return self.first_name  # Adjusted to return only the first name

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

class Recruiter(User):
    company_name = models.CharField(max_length=255, verbose_name=_("Company Name"))
    
    def save(self, *args, **kwargs):
        self.user_type = 'recruiter'
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Recruiter")
        verbose_name_plural = _("Recruiters")
  

class CompanyProfile(models.Model):
    recruiter = models.OneToOneField(Recruiter, on_delete=models.CASCADE, related_name='company_profile')

    company_name = models.CharField(max_length=255, verbose_name=_("Company Name"))
    company_location = models.CharField(max_length=255, verbose_name=_("Company Location"))
    company_strength = models.CharField(max_length=255, verbose_name=_("Company Strength"))
    contact_number = models.CharField(max_length=15, verbose_name=_("Contact Number"))
    email_address = models.EmailField(max_length=255, verbose_name=_("Email Address"))
    company_logo = models.ImageField(upload_to='company_logos/', null=True, blank=True, verbose_name=_("Company Logo"))

    def __str__(self):
        return self.company_name

    class Meta:
        verbose_name = _("Company Profile")
        verbose_name_plural = _("Company Profiles")



class OneTimePassword(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Add this field

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=1)

    def __str__(self):
        return f"{self.user.first_name}-passcode"

    

from django.contrib.auth import get_user_model


User = get_user_model()

class Job(models.Model):
    JOB_TYPES = (
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('intern', 'Intern'),
    )

    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts')
    job_title = models.CharField(max_length=255, verbose_name=_("Job Title"))
    job_type = models.CharField(max_length=20, choices=JOB_TYPES, verbose_name=_("Job Type"))
    salary = models.CharField(max_length=255, verbose_name=_("Salary"))
    vacancies = models.PositiveIntegerField(verbose_name=_("No. of Vacancies"))
    experience = models.CharField(max_length=255, verbose_name=_("Experience"))
    job_location = models.CharField(max_length=255, verbose_name=_("Job Location"))
    job_description = models.TextField(verbose_name=_("Job Description"))
    core_responsibilities = models.TextField(verbose_name=_("Core Responsibilities"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    def __str__(self):
        return self.job_title