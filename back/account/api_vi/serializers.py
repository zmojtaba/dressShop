from rest_framework import serializers
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from ..models import (Adress, Profile)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenBlacklistSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
import re
from rest_framework.response import Response

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'is_staff', 'is_superuser', 'is_active', 'is_verified']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=250, write_only=True)
    class Meta:
        model = User
        fields =[ 'username', 'password', 'password1']
    from decimal import Decimal
    def validate_username(self, attr):
            email_regex = '^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+$'
            phone_regex = '^[/+]\d{2}\d{3}\d{3}\d{4}$'
            is_email    =  re.search(email_regex, attr)
            is_phone    =  re.search(phone_regex, attr) 
            if not is_email:
                if not is_phone :
                    try:
                        int(attr[1:])
                        print('--------------------------',int(attr[1:]) )
                        error_message = 'Enter valid Phone!'
                
                    except:
                        error_message = 'Enter valid Email!'
                    raise serializers.ValidationError({ 'detail' : error_message })        
   
                

            return attr


    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password1'):
            raise serializers.ValidationError({'detail':'Password does not match'})
        try:
            validators.validate_password(password=attrs.get('password'))
        
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({ "detail": list(e.messages)})
        
        return super(UserRegistrationSerializer, self).validate(attrs)
    def create(self, validated_data):
        if '@' in validated_data['username']:
            user = User.objects.create( 
                    username=validated_data['username'],            
                    email = validated_data['username']
                )
        else: 
            user = User.objects.create(
                username = validated_data['username'],
                phone = validated_data['username']
            )

        user.set_password(validated_data['password'])
        user.save()
        return user

class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=250, required=True)


class UserLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        user = User.objects.filter(user=attrs.get('user'))
        if not user:
            raise serializers.ValidationError({"detail": "No active account found with the given credentials"})

        try:
            data = super().validate(attrs)
        except:
            raise serializers.ValidationError({"detail": "Invalid password"})
        data['username'] = self.user.username
        data['access_exp'] = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        data['refresh_exp'] = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        return data

class UserLogoutSerializer(TokenBlacklistSerializer):
    def validate(self, attrs):
        data = super(UserLogoutSerializer, self).validate(attrs)

        data['detail'] = "successfully logged out"

        return data
        

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=250, required=True)
    new_password = serializers.CharField(max_length=250, required=True)
    new_password_confirm = serializers.CharField(max_length=250, required=True)

    class Meta:
        model = User
        fields = ['current_password', 'new_password', 'new_password_confirm']

    def validate(self, attrs):
        if attrs['new_password']!= attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password does not match"})

        try:
            validators.validate_password(password=attrs.get('new_password'))
        
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({ "new_password": e.messages})

        return super().validate(attrs)

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(max_length=250, required=True)
    new_password_confirm = serializers.CharField(max_length=250, required=True)

    def validate(self, attrs):
        if attrs['new_password']!= attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password does not match"})

        try:
            validators.validate_password(password=attrs.get('new_password'))
        
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({ "new_password": e.messages})
        return super().validate(attrs)

# this part is related to profile

class AdressSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    email = serializers.CharField(source='user.email')
    class Meta:
        model = Adress
        fields = ('email', "state", "city", "street", "alley", "plaque", "postalـcode", "extra_commnent",)


class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, use_url=True)
    adress = AdressSerializer(many=True)
    class Meta:
        model = Profile
        fields = ('adress', 'first_name', 'last_name', 'image', 'description',)



        
