import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_model.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:consuetudo/page/widget/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_calendar_carousel/classes/event.dart';
import 'package:flutter_calendar_carousel/flutter_calendar_carousel.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ViewHabitPage extends StatelessWidget {
  const ViewHabitPage({Key key, this.userHabit}) : super(key: key);

  final UserHabit userHabit;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<HabitModel>.value(
      value: HabitModel(
        userId: Provider.of<AuthModel>(context).user.uid,
        userHabit: userHabit,
      ),
      child: Scaffold(
        appBar: AppAppBar(context: context),
        body: Consumer<HabitModel>(
          builder: (_, habitModel, __) {
            final habit = habitModel.userHabit;

            print(habit);
            if (habit == null) {
              return const Text('Not Found...');
            }

            return Container(
              child: Column(
                children: <Widget>[
                  _Head(habit: habit),
                  Card(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: CalendarCarousel<Event>(
                        height: 360.0,
                        locale: Intl.defaultLocale,
                        daysHaveCircularBorder: true,
                        todayButtonColor: Colors.transparent,
                        todayBorderColor: Theme.of(context).primaryColor,
                        todayTextStyle: TextStyle(
                          fontSize: 14.0,
                          color: Theme.of(context).primaryColor,
                        ),
                        customDayBuilder: (bool isSelectable,
                            int index,
                            bool isSelectedDay,
                            bool isToday,
                            bool isPrevMonthDay,
                            TextStyle textStyle,
                            bool isNextMonthDay,
                            bool isThisMonthDay,
                            DateTime day) {
                          if (habit.isRecordedOn(day)) {
                            return Center(
                              child: Icon(Icons.check,
                                  color: Theme.of(context).primaryColor),
                            );
                          }
                          return null;
                        },
                      ),
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: RaisedButton(
                      child: const Text('編集'),
                      onPressed: () async {
                        await Navigator.push<PutHabitPage>(
                          context,
                          MaterialPageRoute(
                            builder: (_) => PutHabitPage(userHabit: habit),
                          ),
                        );
                      },
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: OutlineButton(
                      child: const Text('削除'),
                      onPressed: () {
                        _showConfirmDeleteDialog(
                          context,
                          onConfirm: () async {
                            await habitModel.deleteHabit();
                            Navigator.pop(context);
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  void _showConfirmDeleteDialog(BuildContext context,
      {@required VoidCallback onConfirm}) {
    showDialog<AlertDialog>(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('習慣を削除'),
            content: const Text('削除してよろしいですか？'),
            actions: <Widget>[
              FlatButton(
                child: const Text('キャンセル'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              FlatButton(
                child: const Text('削除'),
                onPressed: () {
                  Navigator.of(context).pop();
                  onConfirm();
                },
              ),
            ],
          );
        });
  }
}

class _Head extends StatelessWidget {
  const _Head({Key key, @required this.habit}) : super(key: key);

  static const double upperHeight = 64.0;
  static const double lowerHeight = 48.0;
  final UserHabit habit;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: upperHeight + lowerHeight,
      child: Stack(
        children: <Widget>[
          Container(
            width: double.infinity,
            height: upperHeight + (lowerHeight / 2.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  Theme.of(context).primaryColor,
                  Theme.of(context).primaryColorLight,
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              height: upperHeight,
              child: Center(
                child: Text(
                  '習慣の記録',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Card(
              child: Container(
                width: 192,
                height: lowerHeight - 8.0, // Padding調整
                child: Center(
                  child: Text(habit.name),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
