from rest_framework.generics import GenericAPIView
from .serializers import UserRegisterSerializer,LoginSerializer,PasswordResetRequestSerializer, SetNewPasswordSerializer,LogoutUserSerializer, GoogleSignInSerializer,RecruiterRegisterSerializer,CompanyProfileSerializer,SkillSerializer
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code_to_user
from .models import OneTimePassword,CompanyProfile, UserProfile
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import User,Recruiter
from rest_framework.generics import GenericAPIView
from .serializers import UserListSerializer, RecruiterListSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import generics,viewsets
from rest_framework.decorators import action
from .models import Skill
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.pagination import PageNumberPagination




# Create your views here.

class RegisterUserView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = serializer.data
            send_code_to_user(user['email'])
            return Response({
                'data': user,
                'message': 'Hi, thanks for signing up. A passcode has been sent to your email.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.core.mail import send_mail
from django.conf import settings
    
class RegisterRecruiterView(GenericAPIView):
    serializer_class = RecruiterRegisterSerializer

    def post(self, request):
        recruiter_data = request.data
        serializer = self.serializer_class(data=recruiter_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            recruiter = serializer.data
            # Notify admin
            send_mail(
                'New Recruiter Registration',
                f'A new recruiter has registered with email {recruiter["email"]}. Please review and approve or reject the registration.',
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            return Response({
                'data': recruiter,
                'message': 'Registration successful. An admin will review your request.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .serializers import RecruiterListSerializer 
from rest_framework.views import APIView

from .utils import send_normal_email  # Ensure you have this import

class PendingRecruitersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_recruiters = Recruiter.objects.filter(is_approved=False)
        serializer = RecruiterListSerializer(pending_recruiters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, recruiter_id):
        action = request.data.get('action')
        try:
            recruiter = Recruiter.objects.get(id=recruiter_id, is_approved=False)
            if action == 'approve':
                recruiter.is_approved = True
                recruiter.is_verified = True  # Mark recruiter as verified
                recruiter.save()
                
                # Send approval email
                email_body = f"Hi {recruiter.first_name}, your recruiter account has been approved. You can now log in using the following link: http://localhost:5173/login"
                email_data = {
                    'email_subject': 'Recruiter Account Approved',
                    'email_body': email_body,
                    'to_email': recruiter.email,
                }
                send_normal_email(email_data)
                
                return Response({'message': 'Recruiter approved'}, status=status.HTTP_200_OK)
            elif action == 'reject':
                # Send rejection email before deleting
                email_body = f"Hi {recruiter.first_name}, we regret to inform you that your recruiter account has been rejected."
                email_data = {
                    'email_subject': 'Recruiter Account Rejected',
                    'email_body': email_body,
                    'to_email': recruiter.email,
                }
                send_normal_email(email_data)
                
                recruiter.delete()
                return Response({'message': 'Recruiter rejected'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        except Recruiter.DoesNotExist:
            return Response({'error': 'Recruiter not found'}, status=status.HTTP_404_NOT_FOUND)

    

class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        otp_code = request.data.get('otp')
        try:
            user_code_obj = OneTimePassword.objects.get(code=otp_code)
            if user_code_obj.is_expired():
                return Response({'message': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = user_code_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({
                    'message': "Account email verified successfully"
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'Code is invalid. User already verified'
            }, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist:
            return Response({'message': 'Invalid OTP'}, status=status.HTTP_404_NOT_FOUND)


class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    


class TestAuthenticationView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data={
            'msg':'its works'
        }
        return Response(data, status=status.HTTP_200_OK)
    

class PasswordResetRequestView(GenericAPIView):
    serializer_class=PasswordResetRequestSerializer

    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)

class PasswordResetConfirm(GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordView(GenericAPIView):
    serializer_class=SetNewPasswordSerializer

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True, 'message':"password reset is succesful"}, status=status.HTTP_200_OK)


class LogoutApiView(GenericAPIView):
    serializer_class=LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    
from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class AdminLogoutApiView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

#Google

class GoogleOauthSignInview(GenericAPIView):
    serializer_class=GoogleSignInSerializer

    def post(self, request):
        print(request.data)
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data=((serializer.validated_data)['access_token'])
        return Response(data, status=status.HTTP_200_OK) 
    
    


    
class UserPagination(PageNumberPagination):
    page_size = 5 # Number of users per page
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserPagination

    def get_queryset(self):
        return User.objects.filter(user_type='normal')
    
#all user for testing
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerialzier

class AllUserListView(APIView):
    def get(self, request):
        current_user = request.user
        chatted_users = User.objects.filter(
            Q(sent_messages__receiver=current_user) | Q(received_messages__sender=current_user)
        ).distinct()
        serializer = UserSerialzier(chatted_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerialzier

class CustomPaginationrecruiter(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50

class RecruiterListView(generics.ListAPIView):
    queryset = Recruiter.objects.all()
    serializer_class = RecruiterListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPaginationrecruiter


# views.py
from .serializers import AdminLoginSerializer
from rest_framework.views import APIView


    
class AdminLoginView(GenericAPIView):
    serializer_class = AdminLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AdminHomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"message": "Welcome to the admin home page."}, status=status.HTTP_200_OK)


from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer

class JobCreateView(generics.CreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user, deleted=False)
    
class JobPostedList(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)
    
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    

from django.db.models import Q

# @api_view(['GET'])
# def job_list(request):
#     job_title = request.query_params.get('job_title', '')
#     job_location = request.query_params.get('job_location', '')

#     jobs = Job.objects.all().order_by('-created_at').filter(deleted=False)
#     print(jobs)

#     if job_title:
#         jobs = jobs.filter(job_title__icontains=job_title)
#     if job_location:
#         jobs = jobs.filter(job_location__icontains=job_location)

#     paginator = StandardResultsSetPagination()
#     result_page = paginator.paginate_queryset(jobs, request)
#     serializer = JobSerializer(result_page, many=True, context={'request': request})
#     return paginator.get_paginated_response(serializer.data)
from operator import or_
from functools import reduce



@api_view(['GET'])
def job_list(request):
    job_title = request.query_params.get('job_title', '')
    job_location = request.query_params.get('job_location', '')

    jobs = Job.objects.all().order_by('-created_at').filter(deleted=False)
    print(jobs)

    if job_title:
        jobs = jobs.filter(job_title__icontains=job_title)
    if job_location:
        jobs = jobs.filter(job_location__icontains=job_location)

    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(jobs, request)
    serializer = JobSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)



@api_view(['GET'])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(status=404)
    
    serializer = JobSerializer(job, context={'request': request})
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id, recruiter=request.user)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    job.deleted = True
    job.save()
    return Response({"message": "Job unlisted successfully"}, status=status.HTTP_204_NO_CONTENT)

from django.db.models import Count


@api_view(['GET'])
def suggested_jobs(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    # Get the skills of the current job
    job_skills = job.skills.all()

    # Find jobs with similar skills
    similar_jobs = Job.objects.filter(skills__in=job_skills).exclude(id=job_id).distinct()

    # Order jobs by the number of matching skills
    similar_jobs = similar_jobs.annotate(matching_skills=Count('skills')).order_by('-matching_skills')

    # Limit to 6 similar jobs
    similar_jobs = similar_jobs[:6]

    serializer = JobSerializer(similar_jobs, many=True, context={'request': request})
    return Response(serializer.data)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_company_profile(request):
    user = request.user
    print(request.data)
    print(user.user_type)

    # Check if the user is a recruiter
    if user.user_type != 'recruiter':
        return Response({'error': 'Only recruiters can create a company profile. lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll'}, status=status.HTTP_403_FORBIDDEN)

    # Fetch the recruiter profile based on the user
    try:
        recruiter = Recruiter.objects.get(id=user.id) # Ensure 'user' is the correct field name in the Recruiter model
    except Recruiter.DoesNotExist:
        return Response({'error': 'Recruiter profile does not exist. lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll '}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompanyProfileSerializer(data=request.data)

    if serializer.is_valid():
        company_profile = serializer.save(recruiter=recruiter)
        return Response(CompanyProfileSerializer(company_profile).data, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyListView(APIView):
    def get(self, request):
        companies = CompanyProfile.objects.all()
        serializer = CompanyProfileSerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompanyProfileDetailView(APIView):
    def get(self, request, pk):
        try:
            company = CompanyProfile.objects.get(pk=pk)
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        

import logging

logger = logging.getLogger(__name__)

class CompanyJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        try:
            company_profile = CompanyProfile.objects.get(id=company_id)
            logger.info(f"CompanyProfile found: {company_profile}")

            jobs = Job.objects.filter(recruiter=company_profile.recruiter, deleted=False)
            logger.info(f"Number of jobs found: {jobs.count()}")

            serializer = JobSerializer(jobs, many=True, context={'request': request})
            logger.info(f"Serialized data: {serializer.data}")

            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            logger.warning(f"CompanyProfile with id {company_id} not found")
            return Response({'error': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in CompanyJobsView: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_company_profile(request, pk):
    try:
        company_profile = CompanyProfile.objects.get(pk=pk)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    print("Received data:", request.data)
    print("Files:", request.FILES)

    serializer = CompanyProfileSerializer(company_profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_profile(request):
    try:
        if not hasattr(request.user, 'recruiter'):
            return Response({'error': 'User has no recruiter profile.'}, status=status.HTTP_404_NOT_FOUND)

        company_profile = CompanyProfile.objects.get(recruiter=request.user.recruiter)
        serializer = CompanyProfileSerializer(company_profile)
        return Response(serializer.data)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_company_about(request):
    try:
        company_profile = CompanyProfile.objects.get(recruiter=request.user.recruiter)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompanyProfileSerializer(company_profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Adminu Logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
from django.db import IntegrityError

# class CreateJobView(APIView):
#     def post(self, request):
#         serializer = JobSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 job = serializer.save(recruiter=request.user)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             except IntegrityError as e:
#                 print(f"IntegrityError: {str(e)}")  # Log the error
#                 return Response(
#                     {"error": "You have already posted a job with this title."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#         print(f"Serializer errors: {serializer.errors}")  # Log serializer errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def get(self, request):
#         jobs = Job.objects.filter(recruiter=request.user)
#         serializer = JobSerializer(jobs, many=True)
#         return Response(serializer.data)

class CreateJobView(APIView):
    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            try:
                job = serializer.save(recruiter=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                print(f"IntegrityError: {str(e)}")  # Log the error
                return Response(
                    {"error": "You have already posted a job with this title."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        print(f"Serializer errors: {serializer.errors}")  # Log serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        jobs = Job.objects.filter(recruiter=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_company_profile(request):
    try:
        if not hasattr(request.user, 'recruiter'):
            return Response(status=status.HTTP_204_NO_CONTENT)

        company_profile = CompanyProfile.objects.get(recruiter=request.user.recruiter)
        return Response(status=status.HTTP_200_OK)
    except CompanyProfile.DoesNotExist:
        return Response(status=status.HTTP_204_NO_CONTENT)

    

class CustomPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100

class SkillListCreateAPIView(APIView):
    pagination_class = CustomPagination

    def get(self, request):
        search_query = request.query_params.get('search', '')
        skills = Skill.objects.filter(name__icontains=search_query)
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(skills, request)
        serializer = SkillSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            skill_name = serializer.validated_data['name']
            existing_skill = Skill.objects.filter(name=skill_name).first()
            if existing_skill:
                return Response({'error': 'Skill already exists'}, status=status.HTTP_409_CONFLICT)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SkillDeleteAPIView(APIView):
    def delete(self, request, pk):
        try:
            skill = Skill.objects.get(pk=pk)
        except Skill.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class CheckUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print("Tryyyyyyy")
            # Check if the user has a profile
            UserProfile.objects.get(user=request.user)
            # If the profile exists, return 200 OK
            return Response(status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            print("Page Doesn't exist")
            # If the profile doesn't exist, return 204 No Content
            return Response(status=status.HTTP_204_NO_CONTENT)
        
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, Skill
from .serializers import UserProfileSerializer
import json
from .serializers import EducationSerializer, ExperienceSerializer


class CreateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        print(user)

        # Check if user already has a profile
        if hasattr(user, 'profile'):
            return Response({"detail": "User profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle skills
        skill_ids = request.data.get('skills', [])
        skill_ids = json.loads(skill_ids)
        skills = Skill.objects.filter(id__in=skill_ids)

        # Create UserProfile
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save(user=user)
            profile.skills.set(skills)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from .models import Experience,Education


class CreateEducationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_profile = request.user.profile
        data = request.data.copy()
        data['user_profile'] = user_profile.id
        serializer = EducationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user_profile = request.user.profile
        educations = Education.objects.filter(user_profile=user_profile)
        serializer = EducationSerializer(educations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateExperienceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_profile = request.user.profile
        data = request.data.copy()
        data['user_profile'] = user_profile.id
        serializer = ExperienceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user_profile = request.user.profile
        experiences = Experience.objects.filter(user_profile=user_profile)
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            print(user_profile)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        

class UpdateUserProfileView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Job
from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import time
from django.core.files.storage import default_storage
import os

import uuid



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request, job_id):
    user = request.user
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=404)
    
    resume_file = request.FILES.get('resume')
    if resume_file:
        filename = f"resume_{user.id}_{job_id}_{int(time.time())}{os.path.splitext(resume_file.name)[1]}"
        file_path = default_storage.save(f'resumes/{filename}', resume_file)
        resume_url = default_storage.url(file_path)
    else:
        resume_url = None

    application = {
        'id': str(uuid.uuid4()),  # Unique ID for each application
        'user_id': user.id,
        'is_immediate_joinee': request.data.get('isImmediateJoinee'),
        'experience': request.data.get('experience'),
        'is_willing_to_relocate': request.data.get('isWillingToRelocate'),
        'resume_url': resume_url,
    }

    # Add the application to the job's applications array
    job.applications.append(application)
    job.save()

    return Response({'message': 'Application submitted successfully'}, status=201)

from django.contrib.auth import get_user_model
User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_applicants(request, job_id):
    try:
        print(f"Fetching applicants for job ID: {job_id}")
        job = Job.objects.get(id=job_id)
        print(f"Job found: {job}")

        # Ensure each application has an 'id' field and include user details
        for app in job.applications:
            if 'id' not in app:
                app['id'] = str(uuid.uuid4())
            user = User.objects.get(id=app['user_id'])
            app['username'] = user.get_full_name
            app['phone_number'] = user.phone_number
            app['email'] = user.email
        job.save()

        return Response(job.applications, status=200)
    except Job.DoesNotExist:
        print(f"Job with ID {job_id} not found")
        return Response({'error': 'Job not found'}, status=404)
    
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_resume(request, application_id):
    try:
        print(f"Searching for application with ID: {application_id}")
        job = Job.objects.filter(applications__contains=[{'id': application_id}]).first()
        if not job:
            print(f"No job found containing application with ID: {application_id}")
            return Response({"error": "Job not found"}, status=404)
        
        application = next((app for app in job.applications if app['id'] == application_id), None)
        if not application:
            print(f"Application with ID {application_id} not found in job")
            return Response({"error": "Application not found"}, status=404)
        
        resume_url = application.get('resume_url')
        if not resume_url:
            print(f"No resume URL found for application {application_id}")
            return Response({"error": "Resume URL not found"}, status=404)
        
        print(f"Attempting to download resume from URL: {resume_url}")
        response = requests.get(resume_url)
        print(f"Cloudinary response status code: {response.status_code}")
        
        if response.status_code == 200:
            django_response = HttpResponse(response.content, content_type='application/pdf')
            django_response['Content-Disposition'] = f'attachment; filename="resume_{application_id}.pdf"'
            return django_response
        else:
            return Response({"error": "File not found on Cloudinary"}, status=404)
    
    except Exception as e:
        print(f"Error in download_resume: {str(e)}")
        return Response({"error": str(e)}, status=500)