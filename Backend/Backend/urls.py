# Backend/Backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.views import (
    CustomTokenObtainPairView,
    RegistroView,
    PerfilUsuarioView,
    RestablecerPasswordView,
    PasswordResetView,
    GoogleLoginView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Autenticación JWT
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Usuarios
    path('api/registro/', RegistroView.as_view(), name='registro'),
    path('api/perfil/', PerfilUsuarioView.as_view(), name='perfil'),
    
    # Recuperación de contraseña - SOLO ESTAS DOS
    path('api/password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/restablecer-password/<str:uidb64>/<str:token>/', RestablecerPasswordView.as_view(), name='restablecer_password'),
    
    # Google OAuth
    path('api/auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('accounts/', include('allauth.urls')),
]