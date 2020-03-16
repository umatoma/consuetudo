import 'package:consuetudo/localizations.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_new_model.dart';
import 'package:consuetudo/page/home_page.dart';
import 'package:consuetudo/page/post_habit_page.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:consuetudo/page/sign_in_page.dart';
import 'package:consuetudo/page/view_habit_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthModel>(
          create: (_) => AuthModel(),
        ),
      ],
      child: MaterialApp(
        title: 'Consuetodo',
        localizationsDelegates: [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('ja'),
        ],
        theme: ThemeData.light().copyWith(
          primaryColor: Colors.lightBlueAccent[700],
          primaryColorLight: Colors.lightBlueAccent[200],
          buttonTheme: ButtonThemeData(
            buttonColor: Colors.lightBlueAccent[700],
            textTheme: ButtonTextTheme.primary,
          ),
        ),
        home: _AppHome(),
      ),
    );
  }
}

class _AppHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context);

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
      child: const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
