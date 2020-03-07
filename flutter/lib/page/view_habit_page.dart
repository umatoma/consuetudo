import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ViewHabitPageArguments {
  final UserHabit habit;

  ViewHabitPageArguments(this.habit);
}

class ViewHabitPage extends StatelessWidget {
  static const routeName = '/viewHabit';

  @override
  Widget build(BuildContext context) {
    final ViewHabitPageArguments args =
        ModalRoute.of(context).settings.arguments;
    final authModel = Provider.of<AuthModel>(context, listen: false);
    final document = Firestore.instance
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(args.habit.id)
        .snapshots();

    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
      ),
      body: StreamBuilder(
          stream: document,
          builder: (context, AsyncSnapshot<DocumentSnapshot> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text('Loading...');
            }

            if (snapshot.data.exists == false) {
              return Text('Not found...');
            }

            return Container(
              padding: EdgeInsets.symmetric(vertical: 0.0, horizontal: 16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text(snapshot.data['id']),
                  Text(snapshot.data['name']),
                  RaisedButton(
                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        PutHabitPage.routeName,
                        arguments: PutHabitPageArguments(snapshot.data),
                      );
                    },
                    child: Text('習慣を編集'),
                  ),
                  RaisedButton(
                    onPressed: () {
                      _showConfirmDeleteDialog(
                        context,
                        onConfirm: () async {
                          await snapshot.data.reference.delete();
                          Navigator.pop(context);
                        },
                      );
                    },
                    child: Text('習慣を削除'),
                  ),
                ],
              ),
            );
          }),
    );
  }

  void _showConfirmDeleteDialog(BuildContext context,
      {@required VoidCallback onConfirm}) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('習慣を削除'),
            content: Text('削除してよろしいですか？'),
            actions: <Widget>[
              FlatButton(
                child: Text('キャンセル'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              FlatButton(
                child: Text('削除'),
                onPressed: () {
                  Navigator.of(context).pop();
                  onConfirm();
                },
              ),
            ],
          );
        });
  }
}
