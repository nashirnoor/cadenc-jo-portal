from rest_framework.generics import GenericAPIView
from .serializers import UserRegisterSerializer,LoginSerializer,PasswordResetRequestSerializer, SetNewPasswordSerializer,LogoutUserSerializer, GoogleSignInSerializer,RecruiterRegisterSerializer,CompanyProfileSerializer,SkillSerializer
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code_to_user
from .models import OneTimePassword,CompanyProfile
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
        print(request.data,"googleeeeeeeee viewwwwwwwwwww posttttt\n goooo\nggggggooo")
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
        return Job.objects.filter(recruiter=self.request.user)
    
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    

from django.db.models import Q

@api_view(['GET'])
def job_list(request):
    job_title = request.query_params.get('job_title', '')
    job_location = request.query_params.get('job_location', '')

    jobs = Job.objects.all().order_by('-created_at')

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

    job.delete()
    return Response({"message": "Job deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




# @api_view(['POST'])
# def create_company_profile(request):
#     print(request.user, "''''''''''''")
#     user = request.user
#     print(user.user_type, "kkkkkkkkkk")
#     print(request.data)
#     if user.user_type != 'recruiter':
#         return Response({'error': 'Only recruiters can create a company profile.'}, status=status.HTTP_403_FORBIDDEN)

#     try:
#         recruiter = Recruiter.objects.get(id=user.id)
#     except Recruiter.DoesNotExist:
#         return Response({'error': 'Recruiter profile does not exist.'}, status=status.HTTP_404_NOT_FOUND)

#     data = request.data
#     serializer = CompanyProfileSerializer(data=data)
#     print("after serializer")

#     if serializer.is_valid():
#         company_profile = serializer.save(recruiter=recruiter)
#         return Response(CompanyProfileSerializer(company_profile).data, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_company_profile(request):
    user = request.user
    print(request.data)

    if user.user_type != 'recruiter':
        return Response({'error': 'Only recruiters can create a company profile.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        recruiter = Recruiter.objects.get(id=user.id)
    except Recruiter.DoesNotExist:
        return Response({'error': 'Recruiter profile does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompanyProfileSerializer(data=request.data)

    if serializer.is_valid():
        company_profile = serializer.save(recruiter=recruiter)
        return Response(CompanyProfileSerializer(company_profile).data, status=status.HTTP_201_CREATED)
    print(serializer.errors)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def update_company_profile(request, pk):
#     try:
#         company_profile = CompanyProfile.objects.get(pk=pk)
#     except CompanyProfile.DoesNotExist:
#         return Response({'error': 'Company profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    
#     if company_profile.recruiter != request.user:
#         return Response({'error': 'You do not have permission to edit this profile.'}, status=status.HTTP_403_FORBIDDEN)

#     serializer = CompanyProfileSerializer(company_profile, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def update_company_profile(request, pk):
#     try:
#         company_profile = CompanyProfile.objects.get(pk=pk)
#     except CompanyProfile.DoesNotExist:
#         return Response({'error': 'Company profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    
#     serializer = CompanyProfileSerializer(company_profile, data=request.data, partial=True)
#     print(serializer)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    print("lllllllllll")
    try:
        company_profile = CompanyProfile.objects.get(recruiter=request.user.recruiter)
        serializer = CompanyProfileSerializer(company_profile)
        return Response(serializer.data)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company profile not found.'}, status=status.HTTP_404_NOT_FOUND)


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
        company_profile = CompanyProfile.objects.get(recruiter=request.user)
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
        skills = Skill.objects.all()
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