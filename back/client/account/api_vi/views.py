from rest_framework.generics import GenericAPIView
from .serializers import (UserRegistrationSerializer ,UserLoginSerializer)
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)

class UserRegistrationApiView(GenericAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):       
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response('registration page',status=status.HTTP_201_CREATED)



class UserLoginView(TokenObtainPairView):

    serializer_class = UserLoginSerializer