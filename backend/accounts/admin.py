from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Django's user admin, adjusted for a user model without username."""

    ordering = ['email']
    list_display = ['email', 'first_name', 'age', 'is_staff']
    search_fields = ['email', 'first_name']
    fieldsets = [
        (None, {'fields': ['email', 'password']}),
        ('Personal info', {'fields': ['first_name', 'age']}),
        (
            'Permissions',
            {'fields': ['is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions']},
        ),
        ('Important dates', {'fields': ['last_login', 'date_joined']}),
    ]
    add_fieldsets = [
        (
            None,
            {'classes': ['wide'], 'fields': ['email', 'usable_password', 'password1', 'password2']},
        ),
    ]
