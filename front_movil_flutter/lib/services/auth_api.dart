import 'api_client.dart';

class AuthApi {
  
  // 🔐 LOGIN
  static Future<Map<String, dynamic>> iniciarSesion(String username, String password) async {
    try {
      // 👇 IMPORTANTE: Solo enviar username y password
      final data = {
        'username': username,
        'password': password,
      };
      
      print('📤 Enviando login: $data');  // Para debug
      
      return await ApiClient.post('/api/token/', data: data);
    } catch (e) {
      print('❌ Error en iniciarSesion: $e');
      throw {'error': 'Error al iniciar sesión'};
    }
  }

  // 📝 REGISTRO
  static Future<Map<String, dynamic>> registrarUsuario(Map<String, dynamic> userData) async {
    try {
      return await ApiClient.post('/api/registro/', data: userData);
    } catch (e) {
      throw {'error': 'Error al registrar usuario'};
    }
  }

  // 🔄 REFRESCAR TOKEN
  static Future<Map<String, dynamic>> refrescarToken(String refreshToken) async {
    try {
      return await ApiClient.post('/api/token/refresh/', data: {
        'refresh': refreshToken
      });
    } catch (e) {
      throw {'error': 'Error al refrescar token'};
    }
  }

  // 📧 SOLICITAR RECUPERACIÓN
  static Future<Map<String, dynamic>> solicitarRecuperacion(String email) async {
    try {
      return await ApiClient.post('/api/password-reset/', data: {'email': email});
    } catch (e) {
      throw {'error': 'Error al solicitar recuperación'};
    }
  }

  // 🔑 RESTABLECER CONTRASEÑA
  static Future<Map<String, dynamic>> restablecerPassword({
    required String uid,
    required String token,
    required String newPassword,
  }) async {
    try {
      print('📤 Enviando a: /api/restablecer-password/$uid/$token/');
      return await ApiClient.post(
        '/api/restablecer-password/$uid/$token/',
        data: {'new_password': newPassword},
      );
    } catch (e) {
      throw {'error': 'Error al restablecer contraseña'};
    }
  }

  // 🟢 LOGIN GOOGLE
  static Future<Map<String, dynamic>> loginConGoogle(String googleToken) async {
    try {
      return await ApiClient.post('/api/auth/google/', data: {'token': googleToken});
    } catch (e) {
      throw {'error': 'Error al iniciar sesión con Google'};
    }
  }

  // 👤 PERFIL
  static Future<Map<String, dynamic>> obtenerPerfil() async {
    try {
      return await ApiClient.get('/api/perfil/');
    } catch (e) {
      throw {'error': 'Error al obtener perfil'};
    }
  }
}