from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health(request):
    """Simple endpoint so the frontend can check that the backend is reachable."""
    return Response({'status': 'ok', 'message': 'Hello from Django'})
