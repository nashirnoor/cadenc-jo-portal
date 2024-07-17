from django.urls import path
from .views import RegisterUserView, VerifyUserEmail, LoginUserView, TestAuthenticationView, PasswordResetRequestView, PasswordResetConfirm, SetNewPasswordView, LogoutApiView, GoogleOauthSignInview, RegisterRecruiterView,UserListView,RecruiterListView,JobListView,JobCreateView,create_company_profile,update_company_profile,get_company_profile,LogoutView, CreateJobView, PendingRecruitersView,check_company_profile,SkillListCreateAPIView,SkillDeleteAPIView,CheckUserProfileView, CreateUserProfileView,UserProfileView,UpdateUserProfileView,apply_job,get_job_applicants,download_resume,JobPostedList,CompanyListView,CompanyProfileDetailView,CompanyJobsView,suggested_jobs,CreateEducationView, CreateExperienceView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from accounts import views




urlpatterns = [
    path('admin/logout/', LogoutView.as_view(), name='admin_logout'),

    # path('google/', GoogleOauthSignInview.as_view(), name='google'),
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
    path('job-posted/', JobPostedList.as_view(), name='job-lists'),
    path('jobs/create/', JobCreateView.as_view(), name='job-create'),
    path('admin/recruiters/pending/', PendingRecruitersView.as_view(), name='pending_recruiters'),
    path('admin/recruiters/pending/<int:recruiter_id>/', PendingRecruitersView.as_view(), name='approve_reject_recruiter'),
    # path('create-company-profile/', create_company_profile, name='create-company-profile'),
    path('company-profile/', create_company_profile, name='create_company_profile'),
    path('company-profile/update/<int:pk>/', update_company_profile, name='update_company_profile'),
    path('company-profile-get/', get_company_profile, name='get_company_profile'),
    path('jobs/create/', CreateJobView.as_view(), name='create-job'),
    path('api/jobs/', views.job_list, name='job-list'),
    path('check-company-profile/', check_company_profile, name='check_company_profile'),
    path('skills/', SkillListCreateAPIView.as_view(), name='skill-list-create'),
    path('skills/<int:pk>/', SkillDeleteAPIView.as_view(), name='skill-delete'),
    path('api/jobs/<int:pk>/', views.job_detail, name='job-detail'),
    path('jobs/delete/<int:job_id>/', views.delete_job, name='delete_job'),
    path('company-profile-update/', views.update_company_about, name='update_company_about'),
    path('check-user-profile/', CheckUserProfileView.as_view(), name='check-user-profile'),
    path('create-user-profile/', CreateUserProfileView.as_view(), name='create-user-profile'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('update-profile/', UpdateUserProfileView.as_view(), name='update-profile'),
    path('<int:job_id>/apply/', apply_job, name='update-profile'),
    path('<int:job_id>/applicants/', get_job_applicants, name='job_applicants'),
    path('download-resume/<str:application_id>/', download_resume, name='download_resume'),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('company-profile-user/<int:pk>/', CompanyProfileDetailView.as_view(), name='company-profile-detail'),
    path('company-jobs/<int:company_id>/', CompanyJobsView.as_view(), name='company-jobs'),
    path('api/jobs/<int:job_id>/suggested/', suggested_jobs, name='suggested-jobs'),
    path('education/', CreateEducationView.as_view(), name='create-education'),
    path('experience/', CreateExperienceView.as_view(), name='create-experience'),












  



    # path('admin/logout/', AdminLogoutApiView.as_view(), name='admin-logout'),

]
