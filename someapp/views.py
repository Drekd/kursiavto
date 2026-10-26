from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Car, Order
from .serializers import CarSerializer, OrderSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class CarListCreateView(generics.ListCreateAPIView):
    serializer_class = CarSerializer
    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == 'POST' else [permissions.AllowAny()]
    def get_queryset(self):
        qs = Car.objects.all()
        p = self.request.query_params
        if p.get('brand'): qs = qs.filter(brand=p['brand'])
        if p.get('body'): qs = qs.filter(body=p['body'])
        if p.get('minPrice'): qs = qs.filter(price__gte=p['minPrice'])
        if p.get('maxPrice'): qs = qs.filter(price__lte=p['maxPrice'])
        if p.get('q'): qs = qs.filter(brand__icontains=p['q']) | qs.filter(model__icontains=p['q'])
        return qs

class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

class CarFiltersView(APIView):
    def get(self, request):
        return Response({
            'brands': list(Car.objects.values_list('brand', flat=True).distinct()),
            'bodies': list(Car.objects.values_list('body', flat=True).distinct()),
        })

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == 'GET' else [permissions.AllowAny()]
    def get_queryset(self):
        return Order.objects.select_related('car').all()

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

class LoginView(APIView):
    def post(self, request):
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if not user or not user.is_staff:
            return Response({'error': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({'token': str(refresh.access_token), 'username': user.username})
