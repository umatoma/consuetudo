import 'package:consuetudo/model/auth_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SignInPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context, listen: false);
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 64.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Container(
                child: const Image(
                  image: AssetImage('assets/images/app_icon.png'),
                  width: 128,
                ),
              ),
              const SizedBox(height: 8),
              const Text('Consuetodo',
                style: TextStyle(fontSize: 24.0),
              ),
              const SizedBox(height: 64),
              Container(
                width: double.infinity,
                child: RaisedButton.icon(
                  icon: Image.asset('assets/images/btn_google_light_normal.png', width: 16),
                  label: const Text('Sign in with Google'),
                  color: Colors.white,
                  onPressed: () => authModel.signIn(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
