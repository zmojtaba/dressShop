from django.contrib import admin
from django.urls import path, include
from .views.account import (UserRegistrationApiView, 
                    UserLoginView, 
                    UserLogoutView, 
                    emailView,
                    ChangePasswordView)
from .views.profile import ProfileView, AdressApiView
from rest_framework_simplejwt.views import (TokenRefreshView,)

app_name = "account_api"
urlpatterns = [
    path('sign-up/', UserRegistrationApiView.as_view(), name='sign_up'),
    path('sign-in/', UserLoginView.as_view(), name='sign_in'),
    path('sign-in/refresh/', TokenRefreshView.as_view(), name='sign_in_refresh'),
    path('sign-out/', UserLogoutView.as_view(), name='sign_out'),
    path('email/', emailView.as_view(), name='email' ),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('adress/', AdressApiView.as_view(), name='address')
]
