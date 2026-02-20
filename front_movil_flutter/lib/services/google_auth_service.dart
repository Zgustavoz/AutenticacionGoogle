import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  GoogleAuthService._();

  static String? get _serverClientId {
    if (Platform.isAndroid) {
      // ⚠️ Debe ser el WEB CLIENT ID
      return dotenv.env['GOOGLE_CLIENT_ID_WEB'];
    }
    return null;
  }

  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: const ['email', 'profile'],
    serverClientId: _serverClientId,
  );

  static Future<Map<String, dynamic>> signIn() async {
    try {
      // 🔥 Fuerza mostrar selector de cuenta
      await _googleSignIn.signOut();

      final GoogleSignInAccount? googleUser =
          await _googleSignIn.signIn();

      if (googleUser == null) {
        return {
          'success': false,
          'error': 'Inicio de sesión cancelado'
        };
      }

      final googleAuth = await googleUser.authentication;

      if (googleAuth.idToken == null) {
        return {
          'success': false,
          'error': 'No se pudo obtener el ID Token'
        };
      }

      return {
        'success': true,
        'idToken': googleAuth.idToken,
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  static Future<void> signOut() async {
    await _googleSignIn.signOut();
  }
}