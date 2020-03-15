import 'package:flutter/material.dart';

class AppAppBar extends AppBar {
  AppAppBar({Key key, @required BuildContext context, List<Widget> actions})
      : super(
            key: key,
            actions: actions,
            title: const Text('Consuetodo'),
            flexibleSpace: Container(
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
            ));
}
