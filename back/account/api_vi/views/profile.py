from rest_framework.generics import GenericAPIView, ListCreateAPIView
from ..serializers import (ProfileSerializer, AdressSerializer, UserSerializer)
from rest_framework.response import Response
from ...models import  Profile, Adress
from django.contrib.auth import get_user_model
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated

User  = get_user_model()



class ProfileView(GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True) 
        serializer.save()
        
        return Response('serializer.data', status=status.HTTP_201_CREATED)


class AdressApiView(GenericAPIView):
    serializer_class = AdressSerializer
    permission_classes = [IsAuthenticated]
    queryset = Adress.objects.all()

    def get(self, request, *args, **kwargs):
        adress = Adress.objects.filter(user=request.user)
        if not adress.exists() :
            return Response({'details':'you have not adress yet'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdressSerializer(adress, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        existing_adress = Adress.objects.filter(user=request.user, 
                                        state=request.data['state'],
                                        city=request.data['city'],
                                        street=request.data['street'],
                                        alley=request.data['alley'],
                                        plaque=request.data['plaque'],
                                        postalـcode=request.data['postalـcode'],)
        if existing_adress.exists():
            raise serializers.ValidationError({'detail' : 'this adress already exists'})
        adress = Adress.objects.create(user=request.user)
        serializer = AdressSerializer(adress, data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user=request.user)
        profile.adress.add(adress)
        serializer.save()
        profile.save()
        return Response(serializer.data, status=status.HTTP_200_OK)