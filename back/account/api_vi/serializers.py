from rest_framework import serializers
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from ..models import (Adress, Profile)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenBlacklistSerializer
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone', 'is_staff', 'is_superuser', 'is_active', 'is_verified']

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

class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=250, required=True)


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



        
