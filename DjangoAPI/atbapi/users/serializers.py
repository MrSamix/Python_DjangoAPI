from rest_framework import serializers
from .utils import compress_image
from .models import CustomUser
from django.contrib.auth import authenticate, get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 
            'username', 
            'email', 
            'phone',
            'first_name', 
            'last_name', 
            'image_small', 
            'image_medium', 
            'image_large'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    image = serializers.ImageField(write_only=True, required=False)  # лише одне поле для upload

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'image',
            'phone',
        ]

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        user = CustomUser.objects.create_user(
            **validated_data
        )

        if image:
            # створюємо 3 розміри
            optimized, name = compress_image(image, size=(300, 300))
            user.image_small.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(800, 800))
            user.image_medium.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(1200, 1200))
            user.image_large.save(name, optimized, save=False)

            user.save()

        return user
    


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        request = self.context.get('request')
        user = authenticate(request=request, username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Невірний логін або пароль.")

        if hasattr(user, "is_active") and not user.is_active:
            raise serializers.ValidationError("Користувач вимкнений.")

        attrs['user'] = user
        return attrs
    
# User = get_user_model()

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists(): # user
            raise serializers.ValidationError("Користувача з таким email не існує")
        return value

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email) # user
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        send_mail(
            subject="Відновлення паролю",
            message=f"",
            fail_silently=False,
            html_message=f"""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #635985;">Відновлення паролю</h2>
                        <p>Щоб змінити пароль, перейдіть за посиланням:</p>
                        <p><a href="{reset_link}" style="background-color:#443C68; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px;">Змінити пароль</a></p>
                        <p>Якщо ви не запитували відновлення, просто ігноруйте цей лист.</p>
                    </div>
                </body>
                </html>
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

class SetNewPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        try:
            uid = urlsafe_base64_decode(attrs['uid']).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise serializers.ValidationError("Невірний uid")

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Невірний або прострочений токен")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()


class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        token = attrs.get("token")
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.CLIENT_ID_OAUTH_GOOGLE)
            email = idinfo.get("email")
            if not email:
                raise serializers.ValidationError("Token does not contain email")

            user, created = CustomUser.objects.get_or_create(email=email, defaults={
                "username": email.split("@")[0]
            })

            attrs['user'] = user
            return attrs
        except ValueError:
            raise serializers.ValidationError("bad google token")