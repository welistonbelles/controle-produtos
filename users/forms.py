from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'cep', 'endereco', 'cidade', 'estado', 'numero', 'bairro', 'complemento')
        labels = {'username': 'Username/E-mail'}

    email = forms.EmailField(label="E-mail", max_length=100)
    first_name = forms.CharField(label="Nome", max_length=100)
    last_name = forms.CharField(label="Sobrenome", max_length=100)
    cep = forms.CharField(label="Cep", max_length=9)
    endereco = forms.CharField(label="Endereco", max_length=100)
    cidade = forms.CharField(label="Cidade", max_length=100)
    estado = forms.CharField(label="Estado", max_length=2)
    numero = forms.IntegerField(label="Numero")
    bairro = forms.CharField(label="Bairro", max_length=100)
    complemento = forms.CharField(label="Complemento", max_length=100)

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.username = self.cleaned_data['email']
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.cep = self.cleaned_data['cep']
        user.endereco = self.cleaned_data['endereco']
        user.cidade = self.cleaned_data['cidade']
        user.estado = self.cleaned_data['estado']
        user.numero = self.cleaned_data['numero']
        user.bairro = self.cleaned_data['bairro']
        user.complemento = self.cleaned_data['complemento']

        if commit:
            user.save()
        return user
        
    def create_user(self):
        print(self.cleaned_data)

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ()
        fields = ('first_name', 'last_name', 'cep', 'endereco', 'cidade', 'estado', 'numero', 'bairro', 'complemento')