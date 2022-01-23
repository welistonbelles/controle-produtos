from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=CustomUser.objects.all())]
            )
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):

        user = CustomUser.objects._create_user(
            self.validated_data['email'], 
            self.validated_data['password'],
            self.validated_data['first_name'],
            self.validated_data['last_name'],
            self.validated_data['cep'],
            self.validated_data['endereco'],
            self.validated_data['cidade'],
            self.validated_data['estado'],
            self.validated_data['numero'],
            self.validated_data['bairro'],
            self.validated_data['complemento']
        )
        return user

    class Meta:
        model = CustomUser
        fields = (
            'first_name',
            'last_name',
            'email',
            'cep',
            'endereco',
            'cidade',
            'estado',
            'numero',
            'bairro',
            'complemento',
            'password'
        )