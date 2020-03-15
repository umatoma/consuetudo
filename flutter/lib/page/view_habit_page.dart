import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/user_habit_model.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:consuetudo/page/widget/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_calendar_carousel/classes/event.dart';
import 'package:flutter_calendar_carousel/flutter_calendar_carousel.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class ViewHabitPageArguments {
  ViewHabitPageArguments(this.habit);

  final UserHabit habit;
}

class ViewHabitPage extends StatelessWidget {
  static const String routeName = '/viewHabit';

  @override
  Widget build(BuildContext context) {
    final ViewHabitPageArguments args =
        ModalRoute.of(context).settings.arguments;
    final UserHabitModel userHabitModel =
        Provider.of<UserHabitModel>(context, listen: false);

    return Scaffold(
      appBar: AppAppBar(context: context),
      body: StreamBuilder<UserHabit>(
          stream: userHabitModel.createUserHabitStream(args.habit),
          builder: (BuildContext context, AsyncSnapshot<UserHabit> snapshot) {
            if (snapshot.data == null) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Text('Loading...');
              } else {
                return const Text('Not found...');
              }
            }

            final habit = snapshot.data;
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
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                          PutHabitPage.routeName,
                          arguments: PutHabitPageArguments(habit),
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
                            await userHabitModel.deleteHabit(habit);
                            Navigator.pop(context);
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          }),
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
