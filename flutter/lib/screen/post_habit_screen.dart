import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_new_model.dart';
import 'package:consuetudo/screen/widget/app_bar.dart';
import 'package:consuetudo/screen/widget/button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PostHabitScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Provider<HabitNewModel>.value(
      value: HabitNewModel(
        userId: Provider.of<AuthModel>(context).user.uid,
      ),
      child: Scaffold(
        appBar: AppAppBar(context: context),
        body: Column(
          children: <Widget>[
            Container(
              height: 64.0,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: <Color>[
                    Theme.of(context).primaryColor,
                    Theme.of(context).primaryColorLight,
                  ],
                ),
              ),
              child: Center(
                child: Text(
                  '習慣を追加',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: _Form(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Form extends StatefulWidget {
  @override
  __FormState createState() => __FormState();
}

class __FormState extends State<_Form> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          TextFormField(
            decoration: const InputDecoration(
              border: UnderlineInputBorder(),
              labelText: '名前',
            ),
            controller: _controller,
            validator: (value) {
              return value.isEmpty ? '入力して下さい' : null;
            },
          ),
          const SizedBox(height: 16.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: CancelButton(onPressed: () {
                  Navigator.pop(context);
                }),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: ConfirmButton(onPressed: _onConfirm),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _onConfirm() async {
    if (_formKey.currentState.validate()) {
      try {
        final habitNewModel =
            Provider.of<HabitNewModel>(context, listen: false);
        final habit = UserHabit(name: _controller.text, recordList: []);
        await habitNewModel.postHabit(habit);

        Navigator.pop(context);
      } catch (e, stackTrace) {
        print(e);
        print(stackTrace);
      }
    }
  }
}
