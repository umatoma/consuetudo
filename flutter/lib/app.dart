//import 'package:flutter/material.dart';
//import 'package:firebase_auth/firebase_auth.dart';
//import 'package:google_sign_in/google_sign_in.dart';
//
//import 'home_page.dart';
//import 'page/sign_in_page.dart';
//
//class App extends StatefulWidget {
//  @override
//  _AppState createState() => _AppState();
//}
//
//class _AppState extends State<App> {
//  final _auth = FirebaseAuth.instance;
//  final _googleSignIn = GoogleSignIn();
//
//  FirebaseUser _user;
//
//  @override
//  Widget build(BuildContext context) {
//    return MaterialApp(
//      title: 'Consuetodo',
//      theme: ThemeData(primarySwatch: Colors.blue),
//      home: (_user == null)
//          ? SignInPage(onSignIn: _signIn)
//          : HomePage(user: _user),
//    );
//  }
//
//  void _signIn() async {
//    try {
//      final googleSignInAccount = await _googleSignIn.signIn();
//      final googleAuth = await googleSignInAccount.authentication;
//      final credential = GoogleAuthProvider.getCredential(
//        idToken: googleAuth.idToken,
//        accessToken: googleAuth.accessToken,
//      );
//      final authRes = await _auth.signInWithCredential(credential);
//      final user = authRes.user;
//
//      setState(() {
//        _user = user;
//      });
//    } catch (e, stackTrace) {
//      print(e);
//      print(stackTrace);
//    }
//  }
//}