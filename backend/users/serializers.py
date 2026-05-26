from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import CustomUser, ActionLog
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

UserModel = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            raise serializers.ValidationError('Неверный email или пароль.')

        if not user.check_password(password):
            raise serializers.ValidationError('Неверный email или пароль.')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = CustomUser.objects.create_user(**validated_data)
        user.role = CustomUser.Role.CUSTOMER
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
        read_only_fields = ('id', 'email', 'role', 'is_active', 'date_joined')


class CreateManagerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = CustomUser.objects.create_user(**validated_data)
        user.role = CustomUser.Role.MANAGER
        user.save()
        return user
    
from .models import ActionLog


class ActionLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, default='Система')
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = ActionLog
        fields = ('id', 'user_email', 'user_name', 'action', 'object_type', 'object_id', 'details', 'created_at')

    def get_user_name(self, obj):
        if obj.user:
            return f'{obj.user.first_name} {obj.user.last_name}'.strip() or obj.user.email
        return 'Система'