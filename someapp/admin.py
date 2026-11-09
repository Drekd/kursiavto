from django.contrib import admin
from .models import Car, Order, Seller, TestDrive, Review

admin.site.register(Car)
admin.site.register(Order)
admin.site.register(Seller)
admin.site.register(TestDrive)
admin.site.register(Review)