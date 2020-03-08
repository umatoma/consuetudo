import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

class UserHabit {
  final String id;
  final String name;
  final List<UserHabitRecord> recordList;

  UserHabit({
    String id,
    @required this.name,
    @required this.recordList,
  }) : this.id = id ?? Uuid().v4();

  UserHabit putName(String name) {
    return UserHabit(id: this.id, name: name, recordList: this.recordList);
  }

  bool isRecordedOn(DateTime dateTime) {
    return this.recordList.any((record) {
      return record.recordDate.isRecordedOn(dateTime);
    });
  }

  UserHabitRecord createRecord(DateTime dateTime) {
    return UserHabitRecord(
      habitId: id,
      recordDate: UserHabitRecordDate(
        year: dateTime.year,
        month: dateTime.month,
        date: dateTime.day,
      ),
    );
  }
}

class UserHabitRecord {
  final String habitId;
  final UserHabitRecordDate recordDate;

  UserHabitRecord({
    @required this.habitId,
    @required this.recordDate,
  });
}

class UserHabitRecordDate {
  final int year;
  final int month;
  final int date;

  UserHabitRecordDate({
    @required this.year,
    @required this.month,
    @required this.date,
  });

  bool isRecordedOn(DateTime dateTime) {
    return (dateTime.year == year &&
        dateTime.month == month &&
        dateTime.day == date);
  }
}
