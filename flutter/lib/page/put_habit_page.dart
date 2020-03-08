import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/user_habit_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PutHabitPageArguments {
  final UserHabit habit;

  PutHabitPageArguments(this.habit);
}

class PutHabitPage extends StatelessWidget {
  static const routeName = '/putHabit';

  @override
  Widget build(BuildContext context) {
    final PutHabitPageArguments args =
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

            return Column(
              children: <Widget>[
                Container(
                  height: 64.0,
                  color: Colors.blue,
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
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: _Form(habit: snapshot.data),
                  ),
                ),
              ],
            );
          }),
    );
  }
}

class _Form extends StatefulWidget {
  final UserHabit habit;

  const _Form({Key key, this.habit}) : super(key: key);

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
            decoration: InputDecoration(
              border: UnderlineInputBorder(),
              labelText: '名前',
            ),
            controller: _controller,
            validator: (value) {
              return value.isEmpty ? '入力して下さい' : null;
            },
          ),
          SizedBox(height: 16.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: OutlineButton(
                  child: Text('キャンセル'),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
              ),
              SizedBox(width: 16.0),
              Expanded(
                child: RaisedButton(
                  color: Colors.blue,
                  textColor: Colors.white,
                  child: Text('決定'),
                  onPressed: _onConfirm,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _onConfirm() async {
    if (_formKey.currentState.validate()) {
      try {
        final userHabitModel =
            Provider.of<UserHabitModel>(context, listen: false);
        final newHabit = widget.habit.putName(_controller.text);
        await userHabitModel.putHabit(newHabit);
        Navigator.pop(context);
      } catch (e, stackTrace) {
        print(e);
        print(stackTrace);
      }
    }
  }
}
