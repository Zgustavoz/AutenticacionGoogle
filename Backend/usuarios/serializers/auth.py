#Backend/usuarios/serializers/auth.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['email'] = user.email if user.email else ''
        
        # Agregar TODOS los roles del usuario
        token['roles'] = list(user.roles.filter(is_active=True).values_list('nombre', flat=True))
        token['roles_ids'] = list(user.roles.filter(is_active=True).values_list('id', flat=True))
        
        # Agregar TODOS los permisos
        token['permisos'] = user.get_permisos()
        
        # Admin si tiene rol admin
        token['es_admin'] = user.es_admin
        
        return token

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'telefono']
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            telefono=validated_data.get('telefono', '')
        )
        
        # Asignar rol cliente automáticamente
        try:
            rol_cliente = Rol.objects.get(nombre='cliente')
            user.roles.add(rol_cliente)
        except Rol.DoesNotExist:
            pass  # Log o manejo de error
        
        user.set_password(validated_data['password'])
        user.save()
        return user