import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_model.dart';
import 'package:consuetudo/page/widget/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PutHabitPage extends StatelessWidget {
  const PutHabitPage({Key key, this.userHabit}) : super(key: key);

  final UserHabit userHabit;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<HabitModel>.value(
      value: HabitModel(
        userId: Provider.of<AuthModel>(context).user.uid,
        userHabit: userHabit,
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
                  '習慣を編集',
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
                child: Consumer<HabitModel>(
                  builder: (_, habitModel, __) {
                    if (habitModel.userHabit == null) {
                      return const Text('Not found...');
                    }
                    return _Form(habit: habitModel.userHabit);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Form extends StatefulWidget {
  const _Form({Key key, this.habit}) : super(key: key);

  final UserHabit habit;

  @override
  __FormState createState() => __FormState();
}

class __FormState extends State<_Form> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();

    _controller.text = widget.habit.name;
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
                child: OutlineButton(
                  child: const Text('キャンセル'),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: RaisedButton(
                  child: const Text('決定'),
                  onPressed: _onConfirm,
                ),
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
        final habitModel = Provider.of<HabitModel>(context, listen: false);
        await habitModel.putHabit(name: _controller.text);
        Navigator.pop(context);
      } catch (e, stackTrace) {
        print(e);
        print(stackTrace);
      }
    }
  }
}
