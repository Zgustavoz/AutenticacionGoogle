import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/google_auth_service.dart';

class GoogleLoginButton extends StatelessWidget {
  const GoogleLoginButton({super.key});

  Future<void> _handleGoogleSignIn(BuildContext context) async {
    final authProvider =
        Provider.of<AuthProvider>(context, listen: false);

    final result = await GoogleAuthService.signIn();

    if (!result['success']) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['error']),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    final loginResult =
        await authProvider.googleLogin(result['idToken']);

    if (!loginResult['success']) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(loginResult['error']),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    if (!context.mounted) return;

    final user = authProvider.user;
    final isAdmin = user?['es_admin'] == true;

    Navigator.pushReplacementNamed(
      context,
      isAdmin ? '/admin' : '/cliente',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        return SizedBox(
          width: double.infinity,
          height: 50,
          child: OutlinedButton(
            onPressed:
                authProvider.isLoading ? null : () => _handleGoogleSignIn(context),
            style: OutlinedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black87,
              side: const BorderSide(color: Colors.grey),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: authProvider.isLoading
                ? const CircularProgressIndicator()
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [ 
                      Image.asset( 
                        'assets/google_logo.png', 
                        height: 24, 
                        errorBuilder: (context, error, stackTrace) { 
                          return const Icon(Icons.g_mobiledata, size: 24); 
                          }, ),
                      SizedBox(width: 8),
                      Text(
                        'Continuar con Google',
                        style: TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
          ),
        );
      },
    );
  }
}