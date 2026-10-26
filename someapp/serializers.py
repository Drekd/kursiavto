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
