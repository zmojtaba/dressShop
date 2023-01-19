from rest_framework import serializers
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from ..models import (User)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenBlacklistSerializer
from django.conf import settings

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=250, write_only=True)
    class Meta:
        model = User
        fields =[ 'email', 'password', 'password1']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password1'):
            raise serializers.ValidationError({'password':'Password does not match'})
        try:
            validators.validate_password(password=attrs.get('password'))
        
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({ "password": list(e.messages)})
        
        return super(UserRegistrationSerializer, self).validate(attrs)
    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        user_eamil = User.objects.filter(email=attrs.get('email'))
        if not user_eamil:
            raise serializers.ValidationError({"email": "No active account found with the given credentials"})

        try:
            data = super().validate(attrs)
        except:
            raise serializers.ValidationError({"password": "Invalid password"})

        data['email'] = self.user.email
        data['access_exp'] = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        data['refresh_exp'] = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        return data


class UserLogoutSerializer(TokenBlacklistSerializer):
    def validate(self, attrs):
        data = super(UserLogoutSerializer, self).validate(attrs)

        data['detail'] = "successfully logged out"

        return data
        
