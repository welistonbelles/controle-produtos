from django.urls import path
from .views import IndexView, DashboardView, ProductsView, ProductViewSet

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/produtos/', ProductsView.as_view(), name='produtos'),
    path('api/v1/products/', ProductViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('api/v1/products/<str:pk>', ProductViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }))
]