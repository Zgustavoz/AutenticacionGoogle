# Backend/Backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def health(request):
    return HttpResponse("OK")

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Health check
    path('health/', health, name='health'),
    
    # Apps del proyecto
    path('usuarios/', include('usuarios.urls')),
    # path('accounts/', include('allauth.urls')),
]