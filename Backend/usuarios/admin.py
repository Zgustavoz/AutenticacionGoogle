from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Rol, Permiso


@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "codigo")
    search_fields = ("nombre", "codigo")


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("nombre", "es_admin")
    filter_horizontal = ("permisos",)


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    fieldsets = UserAdmin.fieldsets + (
        ("Información adicional", {
            "fields": ("telefono", "sexo", "estado", "rol"),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Información adicional", {
            "fields": ("telefono", "sexo", "estado", "rol"),
        }),
    )

    list_display = ("username", "email", "rol", "is_staff", "is_active")
