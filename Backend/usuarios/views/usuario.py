#Backend/usuarios/views/usuario.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Prefetch
from django.contrib.auth import get_user_model
from ..models import Usuario, Rol
from ..serializers.usuario import UsuarioSerializer

User = get_user_model()

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Todos los usuarios autenticados pueden ver
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Para operaciones de escritura, verificar si es admin
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or request.user.es_admin
        )

class UsuarioViewSet(viewsets.ModelViewSet):
  
    queryset = Usuario.objects.all().prefetch_related(
        Prefetch('roles', queryset=Rol.objects.all())
    ).order_by('-date_joined')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):

        queryset = Usuario.objects.all().prefetch_related('roles').distinct()
        
        # Búsqueda por texto (username, email, nombre, apellido)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        # Filtro por roles (puede ser múltiple)
        roles = self.request.query_params.getlist('roles[]', None)
        if roles:
            for rol_id in roles:
                queryset = queryset.filter(roles__id=rol_id)
        
        # Filtro por estado (activo/inactivo)
        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            activo_bool = activo.lower() == 'true'
            queryset = queryset.filter(is_active=activo_bool)
        
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        """
        Evitar que un usuario se elimine a sí mismo
        """
        instance = self.get_object()
        
        if instance.id == request.user.id:
            return Response(
                {"error": "No puedes eliminarte a ti mismo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Obtener el perfil del usuario actual
        GET /api/usuarios/me/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Activar/desactivar un usuario
        POST /api/usuarios/{id}/toggle_active/
        """
        usuario = self.get_object()
        
        # No permitir desactivarse a sí mismo
        if usuario.id == request.user.id:
            return Response(
                {"error": "No puedes cambiar tu propio estado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.is_active = not usuario.is_active
        usuario.save()
        
        return Response({
            "message": f"Usuario {'activado' if usuario.is_active else 'desactivado'}",
            "is_active": usuario.is_active
        })
    
    @action(detail=True, methods=['post'])
    def asignar_roles(self, request, pk=None):
        """
        Asignar múltiples roles a un usuario
        POST /api/usuarios/{id}/asignar_roles/
        {
            "roles_ids": [1, 2, 3]
        }
        """
        usuario = self.get_object()
        roles_ids = request.data.get('roles_ids', [])
        
        if not roles_ids:
            return Response(
                {"error": "Debes proporcionar al menos un rol"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        roles = Rol.objects.filter(id__in=roles_ids, is_active=True)
        usuario.roles.set(roles)
        usuario.save()
        
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def permisos(self, request, pk=None):
        """
        Obtener todos los permisos del usuario (de todos sus roles)
        GET /api/usuarios/{id}/permisos/
        """
        usuario = self.get_object()
        permisos = usuario.get_permisos()
        
        # También devolver permisos detallados por rol
        permisos_por_rol = []
        for rol in usuario.roles.filter(is_active=True):
            permisos_por_rol.append({
                'rol': rol.nombre,
                'permisos': list(rol.permisos.values('id', 'nombre', 'codename'))
            })
        
        return Response({
            'usuario': usuario.username,
            'permisos': permisos,
            'permisos_por_rol': permisos_por_rol
        })
    
    @action(detail=True, methods=['get'])
    def roles(self, request, pk=None):
        """
        Obtener todos los roles de un usuario
        GET /api/usuarios/{id}/roles/
        """
        usuario = self.get_object()
        roles = usuario.roles.filter(is_active=True).values('id', 'nombre', 'descripcion')
        return Response(list(roles))