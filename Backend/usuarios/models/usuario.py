from django.contrib.auth.models import AbstractUser
from django.db import models
from .rol import Rol
from .permiso import Permiso

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    
    roles = models.ManyToManyField(
        Rol,
        related_name='usuarios',
        blank=True
    )
    
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'usuarios_usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} - {self.email}"
    
    @property
    def es_admin(self):
        """Verifica si tiene rol admin"""
        return self.roles.filter(nombre='admin', is_active=True).exists()
    
    def get_permisos(self):
        """Obtiene todos los permisos de todos los roles del usuario"""
        permisos = set()
        for rol in self.roles.filter(is_active=True):
            for permiso in rol.permisos.filter(is_active=True):
                permisos.add(permiso.codename)
        return list(permisos)