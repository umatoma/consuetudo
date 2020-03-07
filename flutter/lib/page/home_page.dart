import 'package:consuetudo/model/AuthModel.dart';
import 'package:consuetudo/page/post_habit_page.dart';
import 'package:consuetudo/page/view_habit_page.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatelessWidget {
  final DateTime targetDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final authModel = Provider.of<AuthModel>(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Consuetodo'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              Navigator.pushNamed(context, PostHabitPage.routeName);
            },
          ),
          PopupMenuButton<VoidCallback>(
            onSelected: (VoidCallback callback) {
              callback();
            },
            itemBuilder: (context) {
              return [
                PopupMenuItem<VoidCallback>(
                  value: () {
                    authModel.signOut();
                  },
                  child: Text('ログアウト'),
                ),
              ];
            },
          )
        ],
      ),
      body: Container(
        child: Column(
          children: <Widget>[
            _Head(targetDate: targetDate),
            Expanded(
              child: _HabitList(targetDate: targetDate),
            ),
          ],
        ),
      ),
    );
  }
}

class _Head extends StatelessWidget {
  static const upperHeight = 64.0;
  static const lowerHeight = 48.0;
  final DateTime targetDate;

  const _Head({Key key, @required this.targetDate}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: upperHeight + lowerHeight,
      child: Stack(
        children: <Widget>[
          Container(
            width: double.infinity,
            height: upperHeight + (lowerHeight / 2.0),
            color: Colors.blue,
          ),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              height: upperHeight,
              child: Row(
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    color: Colors.white,
                    onPressed: () {},
                  ),
                  Expanded(
                    child: Center(
                      child: Text(
                        '習慣を記録',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.arrow_forward_ios),
                    color: Colors.white,
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Card(
              child: Container(
                width: 192,
                height: lowerHeight - 8.0, // Padding調整
                child: Center(
                  child: Text(DateFormat.MMMMd().format(targetDate)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HabitList extends StatelessWidget {
  final DateTime targetDate;

  const _HabitList({Key key, @required this.targetDate}) : super(key: key);

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
            return Card(
              child: ListTile(
                onTap: () {
                  // TODO: Recordの更新処理
                },
                leading: Icon(
                  Icons.check,
                  color: _isRecordedOn(targetDate, document)
                      ? Colors.blue
                      : Colors.grey,
                ),
                title: Text(document['name']),
                trailing: IconButton(
                  icon: Icon(Icons.more_vert),
                  onPressed: () {
                    Navigator.pushNamed(
                      context,
                      ViewHabitPage.routeName,
                      arguments: ViewHabitPageArguments(document),
                    );
                  },
                ),
                contentPadding: EdgeInsets.only(left: 16.0),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  bool _isRecordedOn(DateTime date, DocumentSnapshot document) {
    final List<dynamic> recordList = document['recordList'];
    return recordList.any((record) {
      final Map<String, dynamic> recordDate = record['recordDate'];
      final bool isSameDate = (recordDate['year'] == date.year &&
          recordDate['month'] == date.month &&
          recordDate['date'] == date.day);
      return isSameDate;
    });
  }
}
