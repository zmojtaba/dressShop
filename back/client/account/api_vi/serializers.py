from rest_framework import serializers
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from ..models import (User)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenBlacklistSerializer
import datetime
from django.conf import settings

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=250, write_only=True)
    class Meta:
        model = User
        fields =[ 'email', 'password', 'password1']

    def validate(self, attrs):
        print('password is : ', attrs.get('password'))
        print('password1 is : ', attrs.get('password1'))
        if attrs.get('password') != attrs.get('password1'):
            raise serializers.ValidationError('Password does not match')
        try:
            validators.validate_password(password=attrs.get('password'))
        
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        
        return super(UserRegistrationSerializer, self).validate(attrs)
    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()


class UserLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        data['email'] = self.user.email
        data['access_exp'] = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        data['refresh_exp'] = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        return data


class UserLogoutSerializer(TokenBlacklistSerializer):
    def validate(self, attrs):
        data = super(UserLogoutSerializer, self).validate(attrs)

        data['detail'] = "successfully logged out"

        return data
        
