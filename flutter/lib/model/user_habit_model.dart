import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:flutter/material.dart';

class UserHabitModel {
  final AuthModel authModel;
  final Firestore firestore;

  UserHabitModel({
    @required this.authModel,
    @required this.firestore,
  });

  Stream<List<UserHabit>> createUserHabitListStream() {
    final transformer =
        StreamTransformer<QuerySnapshot, List<UserHabit>>.fromHandlers(
      handleData: (data, sink) {
        final userHabitList = data.documents.map((document) {
          final List<dynamic> recordList = document['recordList'];
          return UserHabit(
            id: document['id'],
            name: document['name'],
            recordList: recordList.map((record) {
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

    final habitListStream = firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .snapshots()
        .transform(transformer);

    return habitListStream;
  }

  Stream<UserHabit> createUserHabitStream(UserHabit habit) {
    final transformer =
        StreamTransformer<DocumentSnapshot, UserHabit>.fromHandlers(
            handleData: (data, sink) {
      final List<dynamic> recordList = data['recordList'];
      final userHabit = UserHabit(
        id: data['id'],
        name: data['name'],
        recordList: recordList.map((record) {
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
      sink.add(userHabit);
    });

    final habitStream = firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habit.id)
        .snapshots()
        .transform(transformer);

    return habitStream;
  }

  Future<void> postHabit(UserHabit habit) async {
    // TODO: Transaction使う？
    final DocumentReference document = Firestore.instance
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habit.id);

    await document.setData({
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

  Future<void> putHabit(UserHabit habit) async {
    // TODO: Transaction使う？
    final reference = firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habit.id);

    await reference.updateData({'name': habit.name});
  }

  Future<void> deleteHabit(UserHabit habit) async {
    // TODO: Transaction使う？
    final reference = firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habit.id);

    await reference.delete();
  }

  Future<void> pushHabitRecord(UserHabitRecord habitRecord) async {
    // TODO: Transaction使う？
    final document = await firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

    // TODO: Entityに処理を移す
    final List<dynamic> recordList = document['recordList'];
    final newRecordList = List.from(recordList);
    newRecordList.add({
      'habitId': habitRecord.habitId,
      'recordDate': {
        'year': habitRecord.recordDate.year,
        'month': habitRecord.recordDate.month,
        'date': habitRecord.recordDate.date,
      },
    });

    await document.reference.updateData({'recordList': newRecordList});
  }

  Future<void> removeHabitRecord(UserHabitRecord habitRecord) async {
    // TODO: Transaction使う？
    final document = await firestore
        .collection('users')
        .document(authModel.user.uid)
        .collection('habits')
        .document(habitRecord.habitId)
        .get();

    // TODO: Entityに処理を移す
    final List<dynamic> recordList = document['recordList'];
    final newRecordList = List.from(recordList);
    newRecordList.removeWhere((record) {
      final Map<String, dynamic> recordDate = record['recordDate'];
      final bool isSameDate =
          (recordDate['year'] == habitRecord.recordDate.year &&
              recordDate['month'] == habitRecord.recordDate.month &&
              recordDate['date'] == habitRecord.recordDate.date);
      return isSameDate;
    });

    await document.reference.updateData({'recordList': newRecordList});
  }
}
