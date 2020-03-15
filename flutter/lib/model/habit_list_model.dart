import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:flutter/foundation.dart';

class HabitListModel extends ChangeNotifier {
  HabitListModel({
    @required this.userId,
  }) {
    _habitListSubscription = _createHabitListStream().listen((habitList) {
      this.habitList = habitList;
      notifyListeners();
    });
  }

  final Firestore _firestore = Firestore.instance;
  StreamSubscription _habitListSubscription;
  final String userId;
  List<UserHabit> habitList = [];

  @override
  void dispose() {
    _habitListSubscription.cancel();
    super.dispose();
  }

  Future<void> postHabit(UserHabit habit) async {
    // TODO: Transaction使う？
    final DocumentReference document = _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habit.id);

    await document.setData(<String, dynamic>{
      'id': habit.id,
      'name': habit.name,
      'recordList': habit.recordList
          .map((record) => {
                'habitId': record.habitId,
                'recordDate': {
                  'year': record.recordDate.year,
                  'month': record.recordDate.month,
                  'date': record.recordDate.date,
                },
              })
          .toList(),
    });
  }

  Future<void> pushHabitRecord(UserHabitRecord habitRecord) async {
    // TODO: Transaction使う？
    final document = await _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

    // TODO: Entityに処理を移す
    final List<dynamic> recordList = document['recordList'];
    final newRecordList = recordList.toList();
    newRecordList.add({
      'habitId': habitRecord.habitId,
      'recordDate': {
        'year': habitRecord.recordDate.year,
        'month': habitRecord.recordDate.month,
        'date': habitRecord.recordDate.date,
      },
    });

    await document.reference
        .updateData(<String, dynamic>{'recordList': newRecordList});
  }

  Future<void> removeHabitRecord(UserHabitRecord habitRecord) async {
    // TODO: Transaction使う？
    final document = await _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

    // TODO: Entityに処理を移す
    final List<dynamic> recordList = document['recordList'];
    final newRecordList = recordList.toList();
    newRecordList.removeWhere((dynamic record) {
      final Map<String, dynamic> recordDate = record['recordDate'];
      final bool isSameDate =
          recordDate['year'] == habitRecord.recordDate.year &&
              recordDate['month'] == habitRecord.recordDate.month &&
              recordDate['date'] == habitRecord.recordDate.date;
      return isSameDate;
    });

    await document.reference
        .updateData(<String, dynamic>{'recordList': newRecordList});
  }

  Stream<List<UserHabit>> _createHabitListStream() {
    final transformer =
        StreamTransformer<QuerySnapshot, List<UserHabit>>.fromHandlers(
      handleData: (data, sink) {
        final userHabitList = data.documents.map((document) {
          final List<dynamic> recordList = document['recordList'];
          return UserHabit(
            id: document['id'],
            name: document['name'],
            recordList: recordList.map((dynamic record) {
              return UserHabitRecord(
                habitId: document['id'],
                recordDate: UserHabitRecordDate(
                  year: record['recordDate']['year'],
                  month: record['recordDate']['month'],
                  date: record['recordDate']['date'],
                ),
              );
            }).toList(),
          );
        }).toList();
        sink.add(userHabitList);
      },
    );

    final habitListStream = _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .snapshots()
        .transform(transformer);

    return habitListStream;
  }
}
