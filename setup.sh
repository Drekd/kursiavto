#!/bin/bash

# Записываем настройки
cat > someproject/settings.py << 'EOF'
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-someproject-key'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'someapp',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'someproject.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [], 'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

WSGI_APPLICATION = 'someproject.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

SIMPLE_JWT = {'ACCESS_TOKEN_LIFETIME': timedelta(hours=12)}
EOF

# Главные urls
cat > someproject/urls.py << 'EOF'
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('someapp.urls')),
]
EOF

# Модели
cat > someapp/models.py << 'EOF'
from django.db import models

class Car(models.Model):
    brand = models.CharField('Марка', max_length=100)
    model = models.CharField('Модель', max_length=100)
    year = models.IntegerField('Год')
    price = models.IntegerField('Цена (руб)')
    mileage = models.IntegerField('Пробег (км)', default=0)
    fuel = models.CharField('Топливо', max_length=50, default='Бензин')
    transmission = models.CharField('КПП', max_length=50, default='Автомат')
    body = models.CharField('Кузов', max_length=50, default='Седан')
    color = models.CharField('Цвет', max_length=50, default='Черный')
    image = models.URLField('URL изображения', blank=True)
    description = models.TextField('Описание', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['-id']
    def __str__(self): return f'{self.brand} {self.model} ({self.year})'

class Order(models.Model):
    STATUS_CHOICES = [('new', 'Новая'), ('done', 'Обработана'), ('cancel', 'Отменена')]
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='orders')
    name = models.CharField('Имя', max_length=100)
    phone = models.CharField('Телефон', max_length=30)
    comment = models.TextField('Комментарий', blank=True)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['-id']
    def __str__(self): return f'Заявка #{self.id} - {self.name}'
EOF

# Сериализаторы
cat > someapp/serializers.py << 'EOF'
from rest_framework import serializers
from .models import Car, Order

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    car_brand = serializers.CharField(source='car.brand', read_only=True)
    car_model = serializers.CharField(source='car.model', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['status']
EOF

# Логика (views)
cat > someapp/views.py << 'EOF'
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
EOF

# Пути (urls)
cat > someapp/urls.py << 'EOF'
from django.urls import path
from . import views

urlpatterns = [
    path('cars/', views.CarListCreateView.as_view()),
    path('cars/filters/', views.CarFiltersView.as_view()),
    path('cars/<int:pk>/', views.CarDetailView.as_view()),
    path('orders/', views.OrderListCreateView.as_view()),
    path('orders/<int:pk>/', views.OrderDetailView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
]
EOF

# Админка
cat > someapp/admin.py << 'EOF'
from django.contrib import admin
from .models import Car, Order
admin.site.register(Car)
admin.site.register(Order)
EOF

echo "✅ Файлы бэкенда готовы!"