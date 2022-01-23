from ast import Index
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.shortcuts import redirect  

from .models import Product
from .serializers import ProductSerializer

# DRF
from rest_framework import viewsets, status
from rest_framework.response import Response

# Create your views here.
class IndexView(TemplateView):
    template_name = 'core/index.html'


class DashboardView(TemplateView):
    template_name = 'core/dashboard.html'

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        context['count_produtos'] = len(Product.objects.all()) or 0
        context['last_product'] = Product.objects.last()
        context['lower_stock'] = Product.objects.all().order_by('stock').first()
        if not request.user.is_authenticated:
            return redirect('index')

        return self.render_to_response(context)

class ProductsView(TemplateView):
    template_name = 'core/produtos.html'

    def get(self, request, *args, **kwargs):

        context = self.get_context_data(**kwargs)
        context['products'] = Product.objects.all()

        return self.render_to_response(context)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request):
        
        # Só retorna resultado para usuários autenticados
        if not request.user.is_authenticated:
            return redirect('index')

        order_list = ['name', '-price', '-stock']
        products = Product.objects.order_by(*order_list)

        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)



    def retrieve(self, request, pk=None):

        if Product.objects.filter(id=pk).exists():
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        return Response({'error': 'Produto inválido'})

    def create(self, request):
        if request.data['name']:
            request.data['name'] = f"{request.data['name'][0].upper()}{request.data['name'][1:]}"
        
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        if request.data['name']:
            request.data['name'] = f"{request.data['name'][0].upper()}{request.data['name'][1:]}"
        
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    
    def destroy(self, request, pk=None):
        if Product.objects.filter(id=pk).exists():
            product = Product.objects.get(id=pk)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Este produto não existe.'})