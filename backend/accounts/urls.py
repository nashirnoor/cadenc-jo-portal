from django.urls import path
from .views import RegisterUserView, VerifyUserEmail, LoginUserView, TestAuthenticationView, PasswordResetRequestView, PasswordResetConfirm, SetNewPasswordView, LogoutApiView, GoogleOauthSignInview, RegisterRecruiterView,UserListView,RecruiterListView,JobListView,JobCreateView,create_company_profile,update_company_profile,get_company_profile,LogoutView, CreateJobView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from accounts import views




urlpatterns = [
    path('admin/logout/', LogoutView.as_view(), name='admin_logout'),

    path('google/', GoogleOauthSignInview.as_view(), name='google'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='verify'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', TestAuthenticationView.as_view(), name='granted'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='reset-password-confirm'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('logout/', LogoutApiView.as_view(), name='logout'),
    path('recruiter/', RegisterRecruiterView.as_view(), name='register_recruiter'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('recruiters/', RecruiterListView.as_view(), name='recruiter-list'),
    path('jobs/', JobListView.as_view(), name='job-list'),
    path('jobs/create/', JobCreateView.as_view(), name='job-create'),
    # path('create-company-profile/', create_company_profile, name='create-company-profile'),
    path('company-profile/', create_company_profile, name='create_company_profile'),
    path('company-profile/update/<int:pk>/', update_company_profile, name='update_company_profile'),
    path('company-profile-get/', get_company_profile, name='get_company_profile'),
    path('jobs/create/', CreateJobView.as_view(), name='create-job'),
    path('api/jobs/', views.job_list, name='job-list'),



    # path('admin/logout/', AdminLogoutApiView.as_view(), name='admin-logout'),

]
