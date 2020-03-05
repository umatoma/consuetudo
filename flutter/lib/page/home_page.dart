import 'package:consuetudo/model/AuthModel.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
        actions: <Widget>[
          PopupMenuButton<VoidCallback>(
            onSelected: (VoidCallback callback) { callback(); },
            itemBuilder: (context) {
              return [
                PopupMenuItem<VoidCallback>(
                  value: () { authModel.signOut(); },
                  child: Text('ログアウト'),
                ),
              ];
            },
          )
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(authModel.user.email),
            Text(authModel.user.displayName),
          ],
        ),
      ),
    );
  }
}
