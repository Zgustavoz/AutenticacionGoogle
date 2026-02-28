from django.db import models

class Permiso(models.Model):
    nombre = models.CharField(max_length=100)
    codename = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'usuarios_permiso'
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return str(self.nombre)