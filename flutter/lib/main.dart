import 'package:consuetudo/model/AuthModel.dart';
import 'package:consuetudo/page/home_page.dart';
import 'package:consuetudo/page/sign_in_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_driver/driver_extension.dart';
import 'package:provider/provider.dart';

void main() {
  // Enable integration testing with the Flutter Driver extension.
  // See https://flutter.dev/testing/ for more info.
  enableFlutterDriverExtension();
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthModel()),
      ],
      child: MaterialApp(
        title: 'Consuetodo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
//        routes: {
//          '/signIn': (context) => SignInPage(),
//          '/home': (context) => HomePage(),
//        },
        home: _AppHome(),
      ),
    );
  }
}

class _AppHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var authModel = Provider.of<AuthModel>(context);

    switch (authModel.authStatus) {
      case AuthStatus.Loading:
        return _AppLoading();
      case AuthStatus.SignedOut:
        return SignInPage();
      case AuthStatus.SignedIn:
        return HomePage();
      default:
        throw Exception('Invalid auth status.');
    }
  }
}

class _AppLoading extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
