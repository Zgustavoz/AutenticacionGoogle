from django.db import models
from .permiso import Permiso

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    es_admin = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # 👇 Relación muchos a muchos con permisos
    permisos = models.ManyToManyField(
        Permiso,
        related_name='roles',
        blank=True
    )

    class Meta:
        db_table = 'usuarios_rol'

    def __str__(self):
        return str(self.nombre)