import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_model.dart';
import 'package:consuetudo/screen/put_habit_screen.dart';
import 'package:consuetudo/screen/widget/app_bar.dart';
import 'package:consuetudo/screen/widget/button.dart';
import 'package:consuetudo/screen/widget/head.dart';
import 'package:flutter/material.dart';
import 'package:flutter_calendar_carousel/classes/event.dart';
import 'package:flutter_calendar_carousel/flutter_calendar_carousel.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ViewHabitScreen extends StatelessWidget {
  const ViewHabitScreen({Key key, this.userHabit}) : super(key: key);

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
                  SubTitledScreenHead(
                    title: '習慣の記録',
                    subTitle: habit.name,
                  ),
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
                    child: PrimaryButton(
                      child: const Text('編集'),
                      onPressed: () async {
                        await Navigator.push<PutHabitScreen>(
                          context,
                          MaterialPageRoute(
                            builder: (_) => PutHabitScreen(userHabit: habit),
                          ),
                        );
                      },
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: SecondaryButton(
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
