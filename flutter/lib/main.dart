import 'package:consuetudo/model/AuthModel.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:consuetudo/page/view_habit_page.dart';
import 'package:consuetudo/page/home_page.dart';
import 'package:consuetudo/page/post_habit_page.dart';
import 'package:consuetudo/page/sign_in_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
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
        routes: {
          PostHabitPage.routeName: (context) => PostHabitPage(),
          ViewHabitPage.routeName: (context) => ViewHabitPage(),
          PutHabitPage.routeName: (context) => PutHabitPage(),
        },
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
