from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import MAX_AGE, MIN_AGE, User


class SignupSerializer(serializers.ModelSerializer):
    # The app asks for a single name; it is stored in Django's built-in first_name field
    name = serializers.CharField(source='first_name', max_length=50)
    age = serializers.IntegerField(min_value=MIN_AGE, max_value=MAX_AGE)
    email = serializers.EmailField(max_length=254)
    # write_only: accepted as input, but never sent back in a response
    password = serializers.CharField(write_only=True, max_length=128, trim_whitespace=False)

    class Meta:
        model = User
        fields = ['id', 'name', 'age', 'email', 'password']

    def validate_email(self, value):
        email = value.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return email

    def validate(self, attrs):
        # Apply the rules from settings.AUTH_PASSWORD_VALIDATORS. They get an unsaved user
        # so that the similarity check can compare the password with name and email.
        user = User(email=attrs['email'], first_name=attrs['first_name'])
        try:
            validate_password(attrs['password'], user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({'password': list(error.messages)})
        return attrs

    def create(self, validated_data):
        # create_user hashes the password before saving
        return User.objects.create_user(**validated_data)
