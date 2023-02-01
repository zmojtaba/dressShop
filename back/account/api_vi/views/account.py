from rest_framework.generics import GenericAPIView
from ..serializers import (UserRegistrationSerializer, 
                        UserLoginSerializer, 
                        UserLogoutSerializer,
                        ChangePasswordSerializer,
                        ResendVerificationEmailSerializer)
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenBlacklistView)
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import threading
from mail_templated import EmailMessage
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

class EmailThreading(threading.Thread):
    def __init__(self, message):
        threading.Thread.__init__(self)
        self.message = message
        
    def run(self):
        self.message.send()

class UserRegistrationApiView(GenericAPIView):
    serializer_class = UserRegistrationSerializer
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh)

    def post(self, request, *args, **kwargs):       
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # send email to created user
        user = User.objects.get(email = serializer.validated_data['email'])
        refresh = self.get_tokens_for_user(user)
        varification_email = EmailMessage('email/email_varification.html', 
                                    {'token':refresh}, 
                                    'kaka.mehrsam@gmail.com', 
                                    [user.email])
        
        EmailThreading(varification_email).start()
        return Response({'detail':"sign up successfully"},status=status.HTTP_201_CREATED)


class ResendEmailVerificationApiView(APIView):
    serializer_class = ResendVerificationEmailSerializer
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh)

    def post(self, request, *args, **kwargs):
        user = User.objects.filter(email = request.data['email'])[0]
        if not user:
            return Response({'detail':'user does not exist'}, status=status.HTTP_404_NOT_FOUND)
        refresh = self.get_tokens_for_user(user)
        varification_email = EmailMessage('email/email_varification.html', 
                                    {'token':refresh}, 
                                    'kaka.mehrsam@gmail.com', 
                                    [user.email])
        EmailThreading(varification_email).start()
        return Response({'detail':"email sent successfully"},status=status.HTTP_201_CREATED)


class VerifyEmailApiView(APIView):
    def get(self, request, token, *args, **kwargs):
        jwt_data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id = jwt_data['user_id'])
        user.is_verified = True
        user.save()
        return Response({'detail':'activation is complete'}, status=status.HTTP_200_OK)




class UserLoginView(TokenObtainPairView):

    serializer_class = UserLoginSerializer

class UserLogoutView(TokenBlacklistView):
    """
        creating custome logout view to show 'successfully logged out' message to the user.
        it inherit TokenBlacklistView that uses TokenBlacklistSerializer.
        we create this serializer class and add our message to it.
    """
    serializer_class = UserLogoutSerializer

from django.contrib.auth import authenticate

class ChangePasswordView(APIView):
    serializer_class = ChangePasswordSerializer
    def post(self, request, *args, **kwargs):
        user = authenticate(email=request.user.email, password=request.data['current_password'])
        if user is None:
            return Response({'detail': 'your current password is not correct'}, status=status.HTTP_406_NOT_ACCEPTABLE)
        serializer = self.serializer_class(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        # user.set_password(request.data['new_password'])
        # user.save()
        serializer.save()
        return Response({'detail': 'success'})
        

# reset password when userhas not loged in yet

class ResetPasswordApiView(APIView):
    '''
    in this view we will send email to user to reset password
    unless we cant find user in database
    '''
    pass

# reset password when user loded in

class UserResetPasswordApiView(APIView):
    '''
    in this case we just change password according to existing user email
    '''
    pass