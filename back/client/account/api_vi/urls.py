from django.contrib import admin
from django.urls import path, include
from .views import (UserRegistrationApiView, UserLoginView)
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)

app_name = "account_api"
urlpatterns = [
    path('signup/', UserRegistrationApiView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
]
