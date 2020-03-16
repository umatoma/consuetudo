import 'dart:async';

import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/repository/user_habit_repository.dart';
import 'package:flutter/foundation.dart';

class HabitListModel extends ChangeNotifier {
  HabitListModel({
    @required String userId,
  }) : repository = UserHabitRepository(userId: userId) {
    _habitListSubscription = repository.getHabitList().listen((habitList) {
      this.habitList = habitList;
      notifyListeners();
    });
  }

  final UserHabitRepository repository;
  StreamSubscription _habitListSubscription;
  List<UserHabit> habitList = [];

  @override
  void dispose() {
    _habitListSubscription.cancel();
    super.dispose();
  }

  Future<void> pushHabitRecord(UserHabitRecord habitRecord) async {
    await repository.pushHabitRecord(habitRecord);
  }

  Future<void> removeHabitRecord(UserHabitRecord habitRecord) async {
    await repository.removeHabitRecord(habitRecord);
  }
}
