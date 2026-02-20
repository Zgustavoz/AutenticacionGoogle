import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:app_links/app_links.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/registro_screen.dart';
import 'screens/recuperar_password_screen.dart';
import 'screens/restablecer_password_screen.dart';
import 'screens/cliente_dashboard.dart';
import 'screens/admin_dashboard.dart';

// GlobalKey para navegar desde cualquier parte
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
late AppLinks _appLinks;

Future<void> initDeepLinks() async {
  _appLinks = AppLinks();
  
  // Escuchar enlaces mientras la app está en ejecución
_appLinks.uriLinkStream.listen((Uri? uri) {
    if (uri != null) {
      _handleDeepLink(uri.toString());
    }
  });

  // Obtener el enlace inicial (cuando la app se abre desde cero)
  final initialUri = await _appLinks.getInitialLink();
  if (initialUri != null) {
    _handleDeepLink(initialUri.toString());
  }
}

void _handleDeepLink(String link) {
  try {
    final uri = Uri.parse(link);
    if (uri.path == '/restablecer-password') {
      final uid = uri.queryParameters['uid'];
      final token = uri.queryParameters['token'];
      
      if (uid != null && token != null) {
        // Esperar a que la UI esté lista
        WidgetsBinding.instance.addPostFrameCallback((_) {
          navigatorKey.currentState?.pushNamed(
            '/restablecer-password',
            arguments: {'uid': uid, 'token': token},
          );
        });
      }
    }
  } catch (e) {
    print('Error al procesar deep link: $e');
  }
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  await initDeepLinks();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuth()),
      ],
      child: MaterialApp(
        title: 'Mi App',
        theme: ThemeData(primarySwatch: Colors.blue),
        navigatorKey: navigatorKey,
        initialRoute: '/',
        
        onGenerateRoute: (settings) {
          // Ruta raíz - decide según autenticación
          if (settings.name == '/') {
            return MaterialPageRoute(
              builder: (context) {
                return Consumer<AuthProvider>(
                  builder: (context, auth, _) {
                    if (auth.isLoading) {
                      return const Scaffold(
                        body: Center(
                          child: CircularProgressIndicator(),
                        ),
                      );
                    }
                    if (auth.isAuthenticated) {
                      return auth.user?['es_admin'] == true
                          ? const AdminDashboard()
                          : const ClienteDashboard();
                    }
                    return const LoginScreen();
                  },
                );
              },
            );
          }
          
          // Rutas fijas
          switch (settings.name) {
            case '/login':
              return MaterialPageRoute(builder: (_) => const LoginScreen());
            case '/registro':
              return MaterialPageRoute(builder: (_) => const RegistroScreen());
            case '/recuperar-password':
              return MaterialPageRoute(builder: (_) => const RecuperarPasswordScreen());
            case '/restablecer-password':
              return MaterialPageRoute(
                builder: (_) => const RestablecerPasswordScreen(),
                settings: settings,  // Para pasar argumentos
              );
            case '/cliente':
              return MaterialPageRoute(builder: (_) => const ClienteDashboard());
            case '/admin':
              return MaterialPageRoute(builder: (_) => const AdminDashboard());
            default:
              return MaterialPageRoute(
                builder: (_) => const Scaffold(
                  body: Center(child: Text('Ruta no encontrada')),
                ),
              );
          }
        },
      ),
    );
  }
}