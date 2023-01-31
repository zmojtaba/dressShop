from rest_framework.generics import GenericAPIView
from ..serializers import (UserRegistrationSerializer, 
                        UserLoginSerializer, 
                        UserLogoutSerializer,)
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenBlacklistView)
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import threading
from mail_templated import EmailMessage
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationApiView(GenericAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):       
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail':"sign up successfully"},status=status.HTTP_201_CREATED)



class UserLoginView(TokenObtainPairView):

    serializer_class = UserLoginSerializer

class UserLogoutView(TokenBlacklistView):
    """
        creating custome logout view to show 'successfully logged out' message to the user.
        it inherit TokenBlacklistView that uses TokenBlacklistSerializer.
        we create this serializer class and add our message to it.
    """
    serializer_class = UserLogoutSerializer



class EmailThreading(threading.Thread):
    def __init__(self, message):
        threading.Thread.__init__(self)
        self.message = message
        
    def run(self):
        self.message.send()

class emailView(APIView):
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def get(self, request, *args, **kwargs):
        user = User.objects.get(email=request.user.email)
        token = self.get_tokens_for_user(user)
        
        message = EmailMessage('email/hello.html', {'token':token}, 'kaka.mehrsam@gmail.com', ['mojtaba.zare8131@gmail.com'])
        EmailThreading(message).start()
        return Response('success')
