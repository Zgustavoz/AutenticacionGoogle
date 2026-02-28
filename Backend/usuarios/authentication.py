# Backend/usuarios/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Primero intenta desde cookie
        access_token = request.COOKIES.get('access_token')
        
        if not access_token:
            # Fallback al header Authorization (por si acaso)
            return super().authenticate(request)
        
        try:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            return None