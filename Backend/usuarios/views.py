# usuarios/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import Usuario, Rol
from decouple import config
from django.core.mail import get_connection
import threading
from .serializers import (
    CustomTokenObtainPairSerializer,
    UsuarioSerializer,
    RegistroSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "user": UsuarioSerializer(user).data,
            "message": "Usuario creado exitosamente. Ahora puedes iniciar sesión."
        }, status=status.HTTP_201_CREATED)


class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class RestablecerPasswordView(APIView):
    """
    Vista para restablecer contraseña usando uid y token en la URL
    Endpoint: /api/restablecer-password/<uidb64>/<token>/
    """
    permission_classes = [AllowAny]
    
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({
                "error": "El enlace de recuperación no es válido"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({
                "error": "El enlace ha expirado o ya fue utilizado"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response({
                "error": "Debes proporcionar una nueva contraseña"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({
                "error": "La contraseña debe tener al menos 8 caracteres"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({
            "message": "Contraseña restablecida exitosamente."
        }, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        print(f"📩 Request recibido para email: {email}")
        
        if not email:
            print("❌ No se proporcionó email")
            return Response({'error': 'El email es requerido'}, status=400)
        
        def send_reset_email(user, email):  # 👈 DEBE estar DENTRO de post()
            try:
                print(f"🧵 Hilo iniciado para: {email}")
                
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{config('FRONTEND_URL')}/reset-password/{uid}/{token}/"
                
                print(f"🔗 Enlace generado: {reset_url}")
                print(f"📤 Desde: {config('EMAIL_HOST_USER')}")
                print(f"🔧 HOST: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
                
                # Probar conexión primero
                connection = get_connection()
                connection.open()
                print(f"✅ Conexión SMTP abierta correctamente")
                connection.close()
                
                result = send_mail(
                    'Recuperación de Contraseña',
                    f'Enlace: {reset_url}',
                    config('EMAIL_HOST_USER'),
                    [email],
                    fail_silently=False,
                )
                print(f"📨 Resultado send_mail: {result}")  # 1 = éxito, 0 = falló
                
                if result == 1:
                    print(f"✅ Email enviado exitosamente a {email}")
                else:
                    print(f"⚠️ send_mail retornó 0, email NO enviado a {email}")
                    
            except Exception as e:
                print(f"❌ Error tipo: {type(e).__name__}")
                print(f"❌ Error detalle: {str(e)}")
                import traceback
                traceback.print_exc()
        
        try:
            print(f"🔍 Buscando usuario con email: {email}")
            user = Usuario.objects.get(email=email)
            print(f"👤 Usuario encontrado: {user.username}")
            
            email_thread = threading.Thread(target=send_reset_email, args=(user, email))
            email_thread.daemon = False
            email_thread.start()
            print(f"🧵 Hilo lanzado correctamente")
            
            return Response({'message': 'Email enviado'}, status=200)
            
        except Usuario.DoesNotExist:
            print(f"⚠️ No existe usuario con email: {email} (respuesta genérica enviada)")
            return Response({'message': 'Email enviado'}, status=200)
        
        except Exception as e:
            print(f"❌ Error inesperado en post(): {type(e).__name__}: {str(e)}")
            return Response({'error': 'Error interno'}, status=500)

class GoogleLoginView(APIView):
    """
    Vista para autenticación con Google
    Endpoint: /api/auth/google/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            token = request.data.get('token')
            
            if not token:
                return Response({
                    'error': 'Token no proporcionado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar el token con Google
            try:
                idinfo = id_token.verify_oauth2_token(
                    token,
                    google_requests.Request(),
                    settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
                )
                
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise ValueError('Wrong issuer.')
                
                email = idinfo['email']
                first_name = idinfo.get('given_name', '')
                last_name = idinfo.get('family_name', '')
                google_id = idinfo['sub']
                
            except ValueError as e:
                return Response({
                    'error': 'Token de Google inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Buscar o crear el usuario
            user, created = Usuario.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] + '_' + google_id[:6],
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            
            # Si es nuevo usuario, asignar rol de cliente
            if created:
                try:
                    rol_cliente = Rol.objects.get(nombre='cliente')
                    user.rol = rol_cliente
                    user.save()
                except Rol.DoesNotExist:
                    rol_cliente = Rol.objects.create(
                        nombre='cliente',
                        descripcion='Rol de cliente por defecto'
                    )
                    user.rol = rol_cliente
                    user.save()
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            refresh['username'] = user.username
            refresh['email'] = user.email
            refresh['rol'] = user.rol.nombre if user.rol else 'cliente'
            refresh['es_admin'] = user.rol.es_admin if user.rol and hasattr(user.rol, 'es_admin') else False
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'rol': user.rol.nombre if user.rol else 'cliente',
                    'es_admin': user.rol.es_admin if user.rol and hasattr(user.rol, 'es_admin') else False,
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Error en el servidor: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)