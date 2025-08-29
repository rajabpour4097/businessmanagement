from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """سریالایزر کاربر"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class LoginSerializer(serializers.Serializer):
    """سریالایزر ورود"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('نام کاربری یا رمز عبور اشتباه است.')
            if not user.is_active:
                raise serializers.ValidationError('حساب کاربری غیرفعال است.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('نام کاربری و رمز عبور الزامی است.')


class UserProfileSerializer(serializers.ModelSerializer):
    """سریالایزر پروفایل کاربر"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number', 'role']
        read_only_fields = ['id', 'username', 'role']


class ChangePasswordSerializer(serializers.Serializer):
    """سریالایزر تغییر رمز عبور"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError('رمز عبور جدید و تایید آن مطابقت ندارد.')
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('رمز عبور فعلی اشتباه است.')
        return value
