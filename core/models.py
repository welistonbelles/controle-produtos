from tkinter.tix import Tree
from django.db import models

# Create your models here.

class Product(models.Model):

    name = models.CharField('Nome', max_length=100)
    price = models.DecimalField('Preço', max_digits=8, decimal_places=2)
    stock = models.IntegerField('Estoque')

    def __str__(self):
        return self.name
