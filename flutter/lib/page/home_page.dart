import 'package:consuetudo/entity/user_habit.dart';
import 'package:consuetudo/model/auth_model.dart';
import 'package:consuetudo/model/habit_list_model.dart';
import 'package:consuetudo/page/post_habit_page.dart';
import 'package:consuetudo/page/view_habit_page.dart';
import 'package:consuetudo/page/widget/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class HomePage extends StatelessWidget {
  final DateTime targetDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<HabitListModel>.value(
      value: HabitListModel(
        userId: Provider.of<AuthModel>(context).user.uid,
      ),
      child: Scaffold(
        appBar: AppAppBar(
          context: context,
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () {
                Navigator.pushNamed(context, PostHabitPage.routeName);
              },
            ),
            PopupMenuButton<VoidCallback>(
              onSelected: (VoidCallback callback) {
                callback();
              },
              itemBuilder: (context) {
                return [
                  PopupMenuItem<VoidCallback>(
                    value: () {
                      Provider.of<AuthModel>(context, listen: false).signOut();
                    },
                    child: const Text('ログアウト'),
                  ),
                ];
              },
            )
          ],
        ),
        body: Consumer<HabitListModel>(
          builder: (_, habitListModel, __) {
            return _PageView(habitList: habitListModel.habitList);
          },
        ),
      ),
    );
  }
}

class _Head extends StatelessWidget {
  const _Head({Key key, @required this.targetDate}) : super(key: key);

  static const upperHeight = 64.0;
  static const lowerHeight = 48.0;
  final DateTime targetDate;

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
              child: Row(
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    color: Colors.white,
                    onPressed: () {},
                  ),
                  const Expanded(
                    child: Center(
                      child: Text(
                        '習慣を記録',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.arrow_forward_ios),
                    color: Colors.white,
                    onPressed: () {},
                  ),
                ],
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
                  child: Text(DateFormat.MMMMd().format(targetDate)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PageView extends StatefulWidget {
  const _PageView({Key key, this.habitList}) : super(key: key);

  final List<UserHabit> habitList;

  @override
  _PageViewState createState() => _PageViewState();
}

class _PageViewState extends State<_PageView> {
  static const int _itemCount = 999999;
  static const int _initialPage = _itemCount ~/ 2;

  PageController _pageController;
  DateTime _referenceDate;
  DateTime _currentDate;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _initialPage);
    _referenceDate = DateTime.now();
    _currentDate = _referenceDate;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          _Head(targetDate: _currentDate),
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: _itemCount,
              onPageChanged: (position) {
                setState(() {
                  final diffDays = position - _initialPage;
                  _currentDate = _referenceDate.add(Duration(days: diffDays));
                });
              },
              itemBuilder: (context, position) {
                final diffDays = position - _initialPage;
                final targetDate = _referenceDate.add(Duration(days: diffDays));
                return _HabitList(
                  key: Key(targetDate.toString()),
                  targetDate: targetDate,
                  userHabitList: widget.habitList,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _HabitList extends StatelessWidget {
  const _HabitList(
      {Key key, @required this.targetDate, @required this.userHabitList})
      : super(key: key);

  final DateTime targetDate;
  final List<UserHabit> userHabitList;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: userHabitList.map((UserHabit userHabit) {
        return Card(
          key: Key(userHabit.id),
          child: ListTile(
            onTap: () {
              if (userHabit.isRecordedOn(targetDate)) {
                Provider.of<HabitListModel>(context, listen: false)
                    .removeHabitRecord(userHabit.createRecord(targetDate));
              } else {
                Provider.of<HabitListModel>(context, listen: false)
                    .pushHabitRecord(userHabit.createRecord(targetDate));
              }
            },
            leading: Icon(
              Icons.check,
              color: userHabit.isRecordedOn(targetDate)
                  ? Theme.of(context).primaryColor
                  : Colors.grey,
            ),
            title: Text(userHabit.name),
            trailing: IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () async {
                Navigator.pushNamed(
                  context,
                  ViewHabitPage.routeName,
                  arguments: ViewHabitPageArguments(userHabit),
                );
              },
            ),
            contentPadding: const EdgeInsets.only(left: 16.0),
          ),
        );
      }).toList(),
    );
  }
}
