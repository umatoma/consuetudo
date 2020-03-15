import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:flutter/foundation.dart';

class HabitNewModel {
  HabitNewModel({@required this.userId});

  final Firestore _firestore = Firestore.instance;
  final String userId;

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
}
