import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

class UserHabit {
  UserHabit({
    String id,
    @required this.name,
    @required this.recordList,
  }) : id = id ?? Uuid().v4();

  final String id;
  final String name;
  final List<UserHabitRecord> recordList;

  UserHabit putName(String name) {
    return UserHabit(id: id, name: name, recordList: recordList);
  }

  UserHabitRecord createRecord(DateTime dateTime) {
    final localDateTime = dateTime.toLocal();
    return UserHabitRecord(
      habitId: id,
      recordDate: UserHabitRecordDate(
        year: localDateTime.year,
        month: localDateTime.month,
        date: localDateTime.day,
      ),
    );
  }

  bool isRecordedOn(DateTime dateTime) {
    return recordList.any((record) {
      return record.recordDate.isRecordedOn(dateTime);
    });
  }
}

class UserHabitRecord {
  UserHabitRecord({
    @required this.habitId,
    @required this.recordDate,
  });

  final String habitId;
  final UserHabitRecordDate recordDate;
}

class UserHabitRecordDate {
  UserHabitRecordDate({
    @required this.year,
    @required this.month,
    @required this.date,
  });

  final int year;
  final int month;
  final int date;

  bool isRecordedOn(DateTime dateTime) {
    final localDateTime = dateTime.toLocal();
    return localDateTime.year == year &&
        localDateTime.month == month &&
        localDateTime.day == date;
  }
}
