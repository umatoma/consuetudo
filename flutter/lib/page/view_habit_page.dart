import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/user_habit_model.dart';
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
    final userHabitModel = Provider.of<UserHabitModel>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
      ),
      body: StreamBuilder(
          stream: userHabitModel.createUserHabitStream(args.habit),
          builder: (context, AsyncSnapshot<UserHabit> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text('Loading...');
            }

            if (snapshot.data == null) {
              return Text('Not found...');
            }

            final habit = snapshot.data;
            return Container(
              padding: EdgeInsets.symmetric(vertical: 0.0, horizontal: 16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text(habit.id),
                  Text(habit.name),
                  RaisedButton(
                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        PutHabitPage.routeName,
                        arguments: PutHabitPageArguments(habit),
                      );
                    },
                    child: Text('習慣を編集'),
                  ),
                  RaisedButton(
                    onPressed: () {
                      _showConfirmDeleteDialog(
                        context,
                        onConfirm: () async {
                          await userHabitModel.deleteHabit(habit);
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
