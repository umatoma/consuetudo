import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/user_habit_model.dart';
import 'package:consuetudo/page/put_habit_page.dart';
import 'package:consuetudo/page/widget/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_calendar_carousel/flutter_calendar_carousel.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class ViewHabitPageArguments {
  final UserHabit habit;

  ViewHabitPageArguments(this.habit);
}

class ViewHabitPage extends StatelessWidget {
  static const routeName = '/viewHabit';

  @override
  Widget build(BuildContext context) {
    final ViewHabitPageArguments args =
        ModalRoute.of(context).settings.arguments;
    final userHabitModel = Provider.of<UserHabitModel>(context, listen: false);

    return Scaffold(
      appBar: AppAppBar(context: context),
      body: StreamBuilder(
          stream: userHabitModel.createUserHabitStream(args.habit),
          builder: (context, AsyncSnapshot<UserHabit> snapshot) {
            if (snapshot.data == null) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Text('Loading...');
              } else {
                return Text('Not found...');
              }
            }

            final habit = snapshot.data;
            return Container(
              child: Column(
                children: <Widget>[
                  _Head(habit: habit),
                  Card(
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 4.0),
                      child: CalendarCarousel(
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
                    padding: EdgeInsets.symmetric(horizontal: 4.0),
                    child: RaisedButton(
                      child: Text('編集'),
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
                    padding: EdgeInsets.symmetric(horizontal: 4.0),
                    child: OutlineButton(
                      child: Text('削除'),
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
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('習慣を削除'),
            content: Text('削除してよろしいですか？'),
            actions: <Widget>[
              FlatButton(
                child: Text('キャンセル'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              FlatButton(
                child: Text('削除'),
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
  static const upperHeight = 64.0;
  static const lowerHeight = 48.0;
  final UserHabit habit;

  const _Head({Key key, @required this.habit}) : super(key: key);

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
