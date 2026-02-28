from rest_framework.permissions import BasePermission


class TienePermiso(BasePermission):

    def has_permission(self, request, view):
        permiso_requerido = getattr(view, "permiso_requerido", None)

        if not permiso_requerido:
            return True

        if not request.user.is_authenticated:
            return False

        return request.user.tiene_permiso(permiso_requerido)