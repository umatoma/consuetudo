import 'package:consuetudo/model/AuthModel.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

class SignInPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var authModel = Provider.of<AuthModel>(context, listen: false);
    return Scaffold(
      body: Container(
        padding: EdgeInsets.symmetric(horizontal: 24.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Container(
                child: Image(
                  image: AssetImage('assets/images/app_icon.png'),
                  width: 128,
                ),
              ),
              SizedBox(height: 8),
              Text('Consuetodo',
                style: TextStyle(fontSize: 24.0),
              ),
              SizedBox(height: 64),
              SignInButton(
                Buttons.Google,
                onPressed: () => authModel.signIn(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
