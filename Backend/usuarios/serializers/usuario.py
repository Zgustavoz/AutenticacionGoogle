#Backend/usuarios/serializers/usuario.py
from rest_framework import serializers
from ..models import Usuario, Rol
from .rol import RolSerializer
from django.contrib.auth.password_validation import validate_password

class UsuarioSerializer(serializers.ModelSerializer):
    roles_info = RolSerializer(source='roles', many=True, read_only=True)
    roles_ids = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.filter(is_active=True),
        many=True,
        write_only=True,
        source='roles',
        required=False
    )
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    permisos = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'telefono', 'roles', 'roles_info', 'roles_ids',
            'is_active', 'date_joined', 'last_login', 'password',
            'permisos', 'es_admin'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'permisos', 'es_admin']
    
    def get_permisos(self, obj):
        return obj.get_permisos()
    
    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])
        password = validated_data.pop('password', None)
        
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefono=validated_data.get('telefono', '')
        )
        
        if password:
            user.set_password(password)
        
        if roles_data:
            user.roles.set(roles_data)
        
        user.save()
        return user
    
    def update(self, instance, validated_data):
        roles_data = validated_data.pop('roles', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        if roles_data is not None:
            instance.roles.set(roles_data)
        
        instance.save()
        return instance