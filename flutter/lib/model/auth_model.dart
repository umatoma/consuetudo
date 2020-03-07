import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

enum AuthStatus {
  Loading,
  SignedOut,
  SignedIn,
}

class AuthModel extends ChangeNotifier {
  final _auth = FirebaseAuth.instance;
  final _googleSignIn = GoogleSignIn();
  FirebaseUser _user;
  AuthStatus _authStatus = AuthStatus.Loading;

  FirebaseUser get user => _user;

  AuthStatus get authStatus => _authStatus;

  AuthModel() {
    _auth.onAuthStateChanged.listen((firebaseUser) {
      _user = firebaseUser;

      if (_user == null) {
        _authStatus = AuthStatus.SignedOut;
      } else {
        _authStatus = AuthStatus.SignedIn;
      }

      notifyListeners();
    });
  }

  void signOut() async {
    await _auth.signOut();
  }

  void signIn() async {
    try {
      await _googleSignIn.signOut();
      final googleSignInAccount = await _googleSignIn.signIn();
      final googleAuth = await googleSignInAccount.authentication;
      final credential = GoogleAuthProvider.getCredential(
        idToken: googleAuth.idToken,
        accessToken: googleAuth.accessToken,
      );
      await _auth.signInWithCredential(credential);
    } catch (e, stackTrace) {
      print(e);
      print(stackTrace);
    }
  }
}
