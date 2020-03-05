import 'package:consuetudo/model/AuthModel.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SignInPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var authModel = Provider.of<AuthModel>(context, listen: false);
    return Scaffold(
      body: Container(
        color: Colors.white,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('Consuetodo'),
              RaisedButton(
                onPressed: () => authModel.signIn(),
                child: Text('Sign in with Google'),
                color: Colors.lightBlueAccent,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
