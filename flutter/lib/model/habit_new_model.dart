import 'dart:async';

import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/repository/user_habit_repository.dart';
import 'package:flutter/foundation.dart';

class HabitNewModel {
  HabitNewModel({@required String userId})
      : repository = UserHabitRepository(userId: userId);

  final UserHabitRepository repository;

  Future<void> postHabit(UserHabit userHabit) async {
    await repository.postHabit(userHabit);
  }
}
