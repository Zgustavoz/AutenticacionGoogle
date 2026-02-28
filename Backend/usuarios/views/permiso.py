from rest_framework import viewsets, permissions
from ..models import Permiso
from ..serializers.permiso import PermisoSerializer

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all().order_by('nombre')
    serializer_class = PermisoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Permiso.objects.all()
        
        # Filtrar por app (si lo necesitas)
        app = self.request.query_params.get('app', None)
        if app:
            queryset = queryset.filter(codename__startswith=f"{app}_")
        
        return queryset