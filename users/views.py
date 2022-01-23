from django.urls import reverse_lazy
from django.views.generic import FormView, TemplateView
from django.urls import reverse_lazy
from django.contrib import messages

from .models import CustomUser
from .serializers import UserSerializer

# DRF
from rest_framework import viewsets, status
from rest_framework.response import Response

class RegisterView(TemplateView):
    template_name = 'users/register.html'
    """form_class = CustomUserForm
    success_url = reverse_lazy('index')

    def form_valid(self, form, *args, **kwargs):
        form.save()
        messages.success(self.request, 'Usuário criado com sucesso.')
        return super(RegisterView, self).form_valid(form, *args, **kwargs)
    
    def form_invalid(self, form, *args, **kwargs):
        return 
        #messages.error(self.request, 'Erro ao cadastrar usuário.')
        #return super(RegisterView, self).form_invalid(form, *args, **kwargs)
"""

class RegisterViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = []

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        if request.data['first_name']:
            request.data['first_name'] =  f"{request.data['first_name'][0].upper()}{request.data['first_name'][1:].lower()}"
        
        if request.data['last_name']:
            request.data['last_name'] =  f"{request.data['last_name'][0].upper()}{request.data['last_name'][1:].lower()}"

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)