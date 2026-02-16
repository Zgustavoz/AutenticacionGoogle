from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import Usuario, Rol

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['email'] = user.email if user.email else ''
        
        if user.rol:
            token['rol'] = user.rol.nombre
            token['es_admin'] = user.rol.es_admin
        else:
            token['rol'] = None
            token['es_admin'] = False
        
        return token

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'telefono']
        read_only_fields = ['id', 'rol']

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirmar contraseña")
    
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'telefono']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        
        if Usuario.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Este email ya está registrado."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            telefono=validated_data.get('telefono', ''),
            rol=Rol.objects.get(nombre='cliente')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        return user