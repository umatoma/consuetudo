import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:flutter/foundation.dart';

class HabitModel extends ChangeNotifier {
  HabitModel({@required this.userId, @required UserHabit userHabit}) {
    _habitSubscription = _createUserHabitStream(userHabit).listen((habit) {
      this.habit = habit;
      notifyListeners();
    });
  }

  final Firestore _firestore = Firestore.instance;
  StreamSubscription _habitSubscription;
  final String userId;
  UserHabit habit;

  @override
  void dispose() {
    _habitSubscription.cancel();
    super.dispose();
  }

  Future<void> putHabit(UserHabit habit) async {
    // TODO: Transaction使う？
    final reference = _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habit.id);

    await reference.updateData(<String, dynamic>{'name': habit.name});
  }

  Future<void> deleteHabit() async {
    // TODO: Transaction使う？
    final reference = _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habit.id);
    await reference.delete();
  }

  Stream<UserHabit> _createUserHabitStream(UserHabit habit) {
    final transformer =
        StreamTransformer<DocumentSnapshot, UserHabit>.fromHandlers(
            handleData: (DocumentSnapshot data, EventSink<UserHabit> sink) {
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
      sink.add(userHabit);
    });

    final habitStream = _firestore
        .collection('users')
        .document(userId)
        .collection('habits')
        .document(habit.id)
        .snapshots()
        .transform(transformer);

    return habitStream;
  }
}
