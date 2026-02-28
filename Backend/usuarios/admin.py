from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Rol, Permiso

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'es_admin', 'is_active', 'fecha_creacion']
    list_filter = ['es_admin', 'is_active']
    search_fields = ['nombre', 'descripcion']
    filter_horizontal = ['permisos']  # 👈 Para asignar permisos fácilmente
    fieldsets = (
        (None, {
            'fields': ('nombre', 'descripcion', 'es_admin', 'is_active')
        }),
        ('Permisos', {
            'fields': ('permisos',),
            'classes': ('wide',),
        }),
    )

@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'codename']
    search_fields = ['nombre', 'codename']
    ordering = ['nombre']

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'get_roles', 'is_active']
    list_filter = ['is_active', 'roles']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filter_horizontal = ['roles']  # 👈 Para asignar múltiples roles
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {
            'fields': ('first_name', 'last_name', 'email', 'telefono')
        }),
        ('Roles', {
            'fields': ('roles',),
            'classes': ('wide',),
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions'),
            'classes': ('wide',),
        }),
        ('Fechas importantes', {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'roles', 'is_active'),
        }),
    )
    
    def get_roles(self, obj):
        """Método para mostrar los roles en list_display"""
        return ", ".join([rol.nombre for rol in obj.roles.all()])
    get_roles.short_description = 'Roles'