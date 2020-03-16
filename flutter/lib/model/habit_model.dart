import 'dart:async';

import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/repository/user_habit_repository.dart';
import 'package:flutter/foundation.dart';

class HabitModel extends ChangeNotifier {
  HabitModel({@required String userId, @required UserHabit userHabit})
      : repository = UserHabitRepository(userId: userId) {
    _habitSubscription = repository.getHabit(userHabit).listen((habit) {
      this.userHabit = habit;
      notifyListeners();
    });
  }

  final UserHabitRepository repository;
  StreamSubscription _habitSubscription;
  UserHabit userHabit;

  @override
  void dispose() {
    _habitSubscription.cancel();
    super.dispose();
  }

  Future<void> putHabit({String name}) async {
    final newHabit = userHabit.putName(name);
    await repository.putHabit(newHabit);
  }

  Future<void> deleteHabit() async {
    await repository.deleteHabit(userHabit);
  }
}
