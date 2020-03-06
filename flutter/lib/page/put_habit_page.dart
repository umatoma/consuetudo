import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class PutHabitPageArguments {
  final DocumentSnapshot habit;

  PutHabitPageArguments(this.habit);
}

class PutHabitPage extends StatelessWidget {
  static const routeName = '/putHabit';

  @override
  Widget build(BuildContext context) {
    final PutHabitPageArguments args =
        ModalRoute
            .of(context)
            .settings
            .arguments;

    return Scaffold(
      appBar: AppBar(
        title: Text('Consuedoto'),
      ),
      body: StreamBuilder(
          stream: args.habit.reference.snapshots(),
          builder: (context, AsyncSnapshot<DocumentSnapshot> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text('Loading...');
            }
            return Container(
              padding: EdgeInsets.symmetric(vertical: 0.0, horizontal: 24.0),
              child: Center(
                child: _Form(habit: snapshot.data),
              ),
            );
          }),
    );
  }
}

class _Form extends StatefulWidget {
  final DocumentSnapshot habit;

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

    _controller.text = widget.habit['name'];
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
              labelText: 'Name',
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
                child: RaisedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text('キャンセル'),
                ),
              ),
              SizedBox(width: 16.0),
              Expanded(
                child: RaisedButton(
                  onPressed: _onConfirm,
                  child: Text('決定'),
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
        final String name = _controller.text;
        final DocumentReference document = widget.habit.reference;
        await document.updateData({'name': name});
        Navigator.pop(context);
      } catch (e, stackTrace) {
        print(e);
        print(stackTrace);
      }
    }
  }
}
