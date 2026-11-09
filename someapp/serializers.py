from rest_framework import serializers
from .models import Car, Order, Seller
from .models import Car, Order, Seller, Review
from .models import Car, Order, Seller, Review, TestDrive

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

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class TestDriveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestDrive
        fields = '__all__'
        read_only_fields = ['status'] 