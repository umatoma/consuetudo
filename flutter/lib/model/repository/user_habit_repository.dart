import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:flutter/cupertino.dart';

class UserHabitRepository {
  UserHabitRepository({@required String userId}) : _userId = userId;

  final Firestore _firestore = Firestore.instance;
  final String _userId;

  Stream<UserHabit> getHabit(UserHabit habit) {
    final transformer =
        StreamTransformer<DocumentSnapshot, UserHabit>.fromHandlers(
            handleData: (DocumentSnapshot snapshot, EventSink<UserHabit> sink) {
      print(snapshot.exists);
      print(snapshot.data['id']);
      if (snapshot.exists == false) return;

      final userHabit = _UserHabitTranslator.dataToUserHabit(snapshot.data);
      sink.add(userHabit);
    });

    final habitStream = _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(habit.id)
        .snapshots()
        .transform(transformer);

    return habitStream;
  }

  Stream<List<UserHabit>> getHabitList() {
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
        .document(_userId)
        .collection('habits')
        .snapshots()
        .transform(transformer);

    return habitListStream;
  }

  Future<void> postHabit(UserHabit userHabit) async {
    final DocumentReference document = _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(userHabit.id);

    await document.setData(<String, dynamic>{
      'id': userHabit.id,
      'name': userHabit.name,
      'recordList': userHabit.recordList
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

  Future<void> putHabit(UserHabit userHabit) async {
    final reference = _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(userHabit.id);

    await reference.updateData(<String, dynamic>{'name': userHabit.name});
  }

  Future<void> deleteHabit(UserHabit userHabit) async {
    final reference = _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(userHabit.id);
    await reference.delete();
  }

  Future<void> pushHabitRecord(UserHabitRecord habitRecord) async {
    final document = await _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

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
    final document = await _firestore
        .collection('users')
        .document(_userId)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

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
}

class _UserHabitTranslator {
  static UserHabit dataToUserHabit(Map<String, dynamic> data) {
    final List<dynamic> recordList = data['recordList'];
    final UserHabit userHabit = UserHabit(
      id: data['id'],
      name: data['name'],
      recordList: recordList.map((dynamic record) {
        return UserHabitRecord(
          habitId: data['id'],
          recordDate: UserHabitRecordDate(
            year: record['recordDate']['year'],
            month: record['recordDate']['month'],
            date: record['recordDate']['date'],
          ),
        );
      }).toList(),
    );
    return userHabit;
  }
}
