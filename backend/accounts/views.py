from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import SignupSerializer


@api_view(['POST'])
# Signing up must work without being logged in
@authentication_classes([])
@permission_classes([AllowAny])
def signup(request):
    """Create an account from the data collected by the onboarding screens."""
    serializer = SignupSerializer(data=request.data)
    # Answers with 400 and the error messages per field if the data is invalid
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
