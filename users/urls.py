from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views
from .views import RegisterViewSet, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('api/v1/register/', RegisterViewSet.as_view({
        'post': 'create',
    })),
    path('', include('django.contrib.auth.urls')),
]