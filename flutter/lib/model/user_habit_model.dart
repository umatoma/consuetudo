import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class UserHabitModel {
  final AuthModel authModel;
  final Firestore firestore;

  UserHabitModel(BuildContext context)
      : this.authModel = Provider.of<AuthModel>(context, listen: false),
        this.firestore = Firestore.instance;

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
