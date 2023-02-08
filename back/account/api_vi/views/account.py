from rest_framework.generics import GenericAPIView
from ..serializers import (UserRegistrationSerializer, 
                        UserLoginSerializer, 
                        UserLogoutSerializer,
                        ChangePasswordSerializer,
                        ResendVerificationEmailSerializer,
                        ResetPasswordSerializer)
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenBlacklistView)
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import threading
from mail_templated import EmailMessage
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
import jwt
from django.conf import settings
from django.http import HttpResponseRedirect

User = get_user_model()

# this part should move to utils.py
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    return str(refresh), str(access)

class EmailThreading(threading.Thread):
    def __init__(self, message):
        threading.Thread.__init__(self)
        self.message = message
        
    def run(self):
        self.message.send()

class UserRegistrationApiView(GenericAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):       
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # send email to created user
        user = User.objects.get(email = serializer.validated_data['email'])
        refresh_token, access_token = get_tokens_for_user(user)
        varification_email = EmailMessage('email/email_varification.html', 
                                    {'token':refresh_token}, 
                                    'kaka.mehrsam@gmail.com', 
                                    [user.email])
        
        EmailThreading(varification_email).start()
        return Response({
            'message':"sign up successfully",
            'refresh_token' : refresh_token,
            'access_token' : access_token,
        },status=status.HTTP_201_CREATED)


class ResendEmailVerificationApiView(APIView):
    serializer_class = ResendVerificationEmailSerializer

    def post(self, request, *args, **kwargs):
        user = User.objects.filter(email = request.data['email'])[0]
        if not user:
            return Response({'detail':'user does not exist'}, status=status.HTTP_404_NOT_FOUND)
        refresh = get_tokens_for_user(user)
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
        return HttpResponseRedirect('http://localhost:4200/')




class UserLoginView(TokenObtainPairView):

    serializer_class = UserLoginSerializer

class UserLogoutView(TokenBlacklistView):
    """
        creating custome logout view to show 'successfully logged out' message to the user.
        it inherit TokenBlacklistView that uses TokenBlacklistSerializer.
        we create this serializer class and add our message to it.
    """
    serializer_class = UserLogoutSerializer



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

class ResetPasswordEmail(APIView):
    serializer_class = ResendVerificationEmailSerializer
    def post(self, request, *args, **kwargs):
        user = User.objects.filter(email = request.data['email'])[0]
        if not user:
            raise serializers.ValidationError({'detail': 'account does not exist'})
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = get_tokens_for_user(user)
        reset_email_message =  EmailMessage(
            'email/email_reset_password.html',
            {'token': token},
            'kaka.mehrsam@gmail.com',
            [user.email]
        )
        EmailThreading(reset_email_message).start()
        return Response({'detail':"email sent successfully"},status=status.HTTP_201_CREATED)


class ResetPasswordConfirm(APIView):
    serializer_class = ResetPasswordSerializer
    def post(self, request, token, *args, **kwargs):
        'check token varify'
        jwt_data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id= jwt_data['user_id'])
        serializers = self.serializer_class(data=request.data)
        serializers.is_valid(raise_exception=True)
        user.set_password(request.data['new_password'])
        user.save()
        return Response('ok',status=status.HTTP_200_OK) 

class ResetPasswordApiView(APIView):
    '''
    in this view we will send email to user to reset password
    unless we cant find user in database
    '''
    

# reset password when user loded in

class UserResetPasswordApiView(APIView):
    '''
    in this case we just change password according to existing user email
    '''
    pass