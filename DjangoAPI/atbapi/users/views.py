from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer, UserSerializer
from .models import CustomUser


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        request=RegisterSerializer,
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='register',
        parser_classes=[parsers.MultiPartParser, parsers.FormParser],
    )
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED
        )
