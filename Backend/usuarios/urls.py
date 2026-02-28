from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth_cookies import CookieTokenObtainPairView, CookieTokenRefreshView, CookieLogoutView
from .views.rol import RolViewSet
from .views.permiso import PermisoViewSet
from .views.usuario import UsuarioViewSet
from .views import (
    # CustomTokenObtainPairView,
    RegistroView,              
    PerfilUsuarioView,        
    PasswordResetView,
    RestablecerPasswordView,
    GoogleLoginView,
)

# Router para viewsets (CRUD automático)
router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'permisos', PermisoViewSet, basename='permiso')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    # JWT Authentication
    # path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #Cookies JWT Authentication
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', CookieLogoutView.as_view(), name='logout'),
        
    # Registro de usuario y perfil
    path('registro/', RegistroView.as_view(), name='registro'),  
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil'), 
    
    # Recuperación de contraseña
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('restablecer-password/<str:uidb64>/<str:token>/', 
         RestablecerPasswordView.as_view(), 
         name='restablecer_password'),
    
    # Autenticación social con Google
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),

    # Roles, permisos y usuarios (CRUD vía router)
    path('', include(router.urls)),
]