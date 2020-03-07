import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

class PostHabitPage extends StatelessWidget {
  static const routeName = '/postHabit';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
      ),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 0.0, horizontal: 24.0),
        child: Center(
          child: _Form(),
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
            decoration: InputDecoration(
              border: UnderlineInputBorder(),
              labelText: 'Name',
            ),
            controller: _controller,
            validator: (value) { return value.isEmpty ? '入力して下さい' : null; },
          ),
          SizedBox(height: 16.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: RaisedButton(
                  onPressed: () { Navigator.pop(context); },
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
        final authModel = Provider.of<AuthModel>(context, listen: false);
        final String id = Uuid().v4();
        final String name = _controller.text;
        final DocumentReference document = Firestore.instance
            .collection('users')
            .document(authModel.user.uid)
            .collection('habits')
            .document(id);
        await document.setData({
          'id': id,
          'name': name,
          'recordList': [],
        });
        Navigator.pop(context);
      } catch (e, stackTrace) {
        print(e);
        print(stackTrace);
      }
    }
  }
}

