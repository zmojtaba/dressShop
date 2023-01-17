from django.contrib import admin
from django.urls import path, include
from .views import (UserRegistrationApiView, UserLoginView, UserLogoutView)
from rest_framework_simplejwt.views import (TokenRefreshView,)

app_name = "account_api"
urlpatterns = [
    path('signup/', UserRegistrationApiView.as_view(), name='signup'),
    path('signin/', UserLoginView.as_view(), name='signin'),
    path('signin/refresh/', TokenRefreshView.as_view(), name='signin_refresh'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
]
