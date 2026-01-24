from django.contrib import admin

# Register your models here.

from .models import CustomUser
from .serializers import UserSerializer


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'phone')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')