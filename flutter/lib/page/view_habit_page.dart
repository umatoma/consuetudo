import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:flutter/material.dart';

class ViewHabitPageArguments {
  final DocumentSnapshot habit;

  ViewHabitPageArguments(this.habit);
}

class ViewHabitPage extends StatelessWidget {

  static const routeName = '/viewHabit';

  @override
  Widget build(BuildContext context) {
    final ViewHabitPageArguments args = ModalRoute.of(context).settings.arguments;

    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
      ),
      body: StreamBuilder(
        stream: args.habit.reference.snapshots(),
        builder: (context, AsyncSnapshot<DocumentSnapshot> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Text('Loading...');
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
                  onPressed: () {},
                  child: Text('習慣を削除'),
                ),
              ],
            ),
          );
        }
      ),
    );
  }
}
