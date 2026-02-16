from django.db import models
from django.contrib.auth.models import AbstractUser

class Permiso(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    codigo = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    
    def __str__(self):
        return str(self.codigo)

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    permisos = models.ManyToManyField(
        Permiso,
        blank=True,
        related_name="roles"
    )
    es_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return str(self.nombre)

class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    sexo = models.CharField(max_length=10, blank=True, null=True)
    estado = models.BooleanField(default=True)
    rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios"
    )
    
    def tiene_permiso(self, codigo_permiso):
        if not self.rol:
            return False
        if self.rol.es_admin:
            return True
        return self.rol.permisos.filter(codigo=codigo_permiso).exists()
    
    def __str__(self):
        return str(self.username)