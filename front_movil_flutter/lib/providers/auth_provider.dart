import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_api.dart';
import 'dart:convert';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _isLoading = false;

  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  // Decodificar token JWT (como atob en JS)
  Map<String, dynamic> _decodeToken(String token) {
    final parts = token.split('.');
    if (parts.length != 3) throw Exception('Token inválido');
    
    final payload = parts[1];
    // Añadir padding base64 si es necesario
    final normalized = base64.normalize(payload);
    final decoded = utf8.decode(base64.decode(normalized));
    return jsonDecode(decoded);
  }

  // 📌 INICIAR SESIÓN
  Future<Map<String, dynamic>> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final data = await AuthApi.iniciarSesion(username, password);

      // Guardar tokens
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', data['access']);
      await prefs.setString('refresh_token', data['refresh']);

      // Decodificar token
      final payload = _decodeToken(data['access']);
      _user = {
        'id': payload['user_id'],
        'username': payload['username'],
        'email': payload['email'],
        'rol': payload['rol'],
        'es_admin': payload['es_admin'],
      };

      print('✅ Usuario autenticado: $_user');
      return {'success': true, 'user': _user};
    } catch (e) {
      print('❌ Error en login: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 📝 REGISTRO
  Future<void> registro(Map<String, dynamic> userData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final data = await AuthApi.registrarUsuario(userData);
      print('✅ Registro exitoso: $data');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 🟢 GOOGLE LOGIN
  Future<Map<String, dynamic>> googleLogin(String idToken) async {
    _isLoading = true;
    notifyListeners();

    try {
      print('📤 Enviando token a backend: $idToken');
      
      final data = await AuthApi.loginConGoogle(idToken);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', data['access']);
      await prefs.setString('refresh_token', data['refresh']);

      _user = data['user'];
      print('✅ Usuario Google autenticado: $_user');
      
      return {'success': true, 'user': _user};
    } catch (e) {
      print('❌ Error en Google login: $e');
      return {'success': false, 'error': e.toString()};
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 📧 RECUPERAR CONTRASEÑA
  Future<void> recuperarPassword(String email) async {
    _isLoading = true;
    notifyListeners();

    try {
      await AuthApi.solicitarRecuperacion(email);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 🔑 RESTABLECER CONTRASEÑA
  Future<void> restablecerPassword({
    required String uid,
    required String token,
    required String newPassword,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      await AuthApi.restablecerPassword(
        uid: uid,
        token: token,
        newPassword: newPassword,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 🚪 CERRAR SESIÓN
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    _user = null;
    notifyListeners();
  }

  // 🔄 VERIFICAR SESIÓN AL INICIAR
  Future<void> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    
    if (token != null) {
      try {
        final payload = _decodeToken(token);
        _user = {
          'id': payload['user_id'],
          'username': payload['username'],
          'email': payload['email'],
          'rol': payload['rol'],
          'es_admin': payload['es_admin'],
        };
      } catch (e) {
        await logout();
      }
    }
    notifyListeners();
  }
}