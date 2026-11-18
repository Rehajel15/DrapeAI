from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Plausibility bounds only, not a minimum-age policy
MIN_AGE = 1
MAX_AGE = 120


class UserManager(BaseUserManager):
    """Creates users that are identified by their email address instead of a username."""

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email address must be set')
        # Store emails in lowercase so the same address cannot be registered twice
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        # set_password stores a hash, never the plain password
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    # The email address replaces the username as the login identifier.
    # The name asked for in the app is stored in the inherited first_name field.
    username = None
    email = models.EmailField('email address', unique=True)
    age = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(MIN_AGE), MaxValueValidator(MAX_AGE)],
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
