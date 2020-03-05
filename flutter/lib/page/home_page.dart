import 'package:consuetudo/model/AuthModel.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () { Navigator.pushNamed(context, '/postHabit'); },
          ),
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
      body: _HabitList(),
    );
  }
}

class _HabitList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context);
    final habitListStream = Firestore.instance
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .snapshots();

    return StreamBuilder(
      stream: habitListStream,
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text('Loading...');
        }
        return ListView(
          children: snapshot.data.documents.map((DocumentSnapshot document) {
            return ListTile(
              title: Text(document['id']),
              subtitle: Text(document['name']),
            );
          }).toList(),
        );
      },
    );
  }
}
