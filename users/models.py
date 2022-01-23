from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, password, first_name, last_name, cep, endereco, cidade, estado, numero, bairro, complemento):
        if not email:
            raise ValueError('O e-mail é obrigatório')
        email = self.normalize_email(email)
        user = self.model(
            email=email, username=email, 
            first_name=first_name,
            last_name=last_name,
            cep=cep,
            endereco=endereco,
            cidade=cidade,
            estado=estado,
            numero=numero,
            bairro=bairro,
            complemento=complemento
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_user(self, email, password=None, **extra_fields):
        print("Linha 21")
        extra_fields.setdefault('is_staff', True)
        return self._create_user(email, password, **extra_fields)


    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser precisa ter is_superuser=True')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser precisa ter is_staff=True')

        return self._create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField('E-mail', unique=True, max_length=100)
    cep = models.CharField('Cep', max_length=9, blank=True)
    endereco = models.CharField('Endereco', max_length=100, blank=True)
    cidade = models.CharField('Cidade', max_length=100, blank=True)
    estado = models.CharField('Estado', max_length=100, blank=True)
    numero = models.IntegerField('Numero', blank=True)
    bairro = models.CharField('Bairro', max_length=100, blank=True)
    complemento = models.CharField('Complemento', max_length=100, blank=True)
    password = models.CharField('Senha', max_length=100)

    is_superuser= models.BooleanField(default=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'cep', 'endereco', 'cidade', 'estado', 'numero', 'bairro', 'complemento']

    def __str__(self):
        return self.email

    objects = CustomUserManager()    