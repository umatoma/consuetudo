import 'package:intl/intl.dart';
import 'package:consuetudo/entity/user_habit.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {

  setUpAll(() {
    Intl.defaultLocale = 'ja';
  });

  group('UserHabit', () {
    group('constructor', () {
      test('idが生成される', () {
        final habit = UserHabit(name: 'NAME', recordList: []);

        expect(habit.id, isNotEmpty);
      });
    });

    group('putName', () {
      test('nameが更新される', () {
        final oldHabit = UserHabit(name: 'OLD', recordList: []);
        final newHabit = oldHabit.putName('NEW');

        expect(newHabit.name, equals('NEW'));
      });
    });

    group('createRecord', () {
      test('UserHabitRecordDateが生成される', () {
        final habit = UserHabit(id: 'ID', name: 'NAME', recordList: []);

        final dateTime = DateTime.parse('2999-01-23T00:00:00+09:00');
        final record = habit.createRecord(dateTime);

        expect(record.habitId, equals('ID'));
        expect(record.recordDate.year, equals(2999));
        expect(record.recordDate.month, equals(1));
        expect(record.recordDate.date, equals(23));
      });
    });

    group('isRecordedOn', () {
      final habit = UserHabit(name: 'NAME', recordList: [
        UserHabitRecord(
            habitId: '',
            recordDate: UserHabitRecordDate(year: 2999, month: 1, date: 23)),
        UserHabitRecord(
            habitId: '',
            recordDate: UserHabitRecordDate(year: 2999, month: 5, date: 18)),
      ]);

      test('指定した日付の記録が ある 場合は true を返す', () {
        expect(habit.isRecordedOn(DateTime.parse('2999-01-23T00:00:00+09:00')), isTrue);
        expect(habit.isRecordedOn(DateTime.parse('2999-05-18T00:00:00+09:00')), isTrue);
      });

      test('指定した日付の記録が ない 場合は false を返す', () {
        expect(habit.isRecordedOn(DateTime.parse('2999-01-22T00:00:00+09:00')), isFalse); // 前日
        expect(habit.isRecordedOn(DateTime.parse('2999-01-24T00:00:00+09:00')), isFalse); // 翌日
        expect(habit.isRecordedOn(DateTime.parse('9999-01-23T00:00:00+09:00')), isFalse); // 年違い
        expect(habit.isRecordedOn(DateTime.parse('2999-09-23T00:00:00+09:00')), isFalse); // 月違い
        expect(habit.isRecordedOn(DateTime.parse('2999-01-30T00:00:00+09:00')), isFalse); // 日違い
      });
    });
  });
}
