import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

enum AuthStatus {
  Loading,
  SignedOut,
  SignedIn,
}

class AuthModel extends ChangeNotifier {
  AuthModel() {
    _auth.onAuthStateChanged.listen((firebaseUser) {
      user = firebaseUser;

      if (user == null) {
        authStatus = AuthStatus.SignedOut;
      } else {
        authStatus = AuthStatus.SignedIn;
      }

      notifyListeners();
    });
  }

  final _auth = FirebaseAuth.instance;
  final _googleSignIn = GoogleSignIn();

  FirebaseUser user;
  AuthStatus authStatus = AuthStatus.Loading;

  Future<void> signOut() async {
    await _auth.signOut();
  }

  Future<void> signIn() async {
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
