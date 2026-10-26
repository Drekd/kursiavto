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
