import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ScreenHead extends StatelessWidget {
  const ScreenHead({
    Key key,
    @required this.title,
  }) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return _BaseContainer(
      height: 64.0,
      child: Center(
        child: _TitleText(title),
      ),
    );
  }
}

class SubTitledScreenHead extends StatelessWidget {
  const SubTitledScreenHead({
    Key key,
    @required this.title,
    @required this.subTitle,
    this.leftIconButton,
    this.rightIconButton,
  }) : super(key: key);

  static const double upperHeight = 64.0;
  static const double lowerHeight = 48.0;
  final String title;
  final String subTitle;
  final IconButton leftIconButton;
  final IconButton rightIconButton;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: upperHeight + lowerHeight,
      child: Stack(
        children: <Widget>[
          _BaseContainer(height: upperHeight + (lowerHeight / 2.0)),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              height: upperHeight,
              child: Row(
                children: <Widget>[
                  leftIconButton ?? Container(),
                  Expanded(
                    child: Center(
                      child: _TitleText(title),
                    ),
                  ),
                  rightIconButton ?? Container(),
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
                  child: Text(subTitle),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BaseContainer extends Container {
  _BaseContainer({
    Key key,
    @required this.height,
    Widget child,
  }) : super(
    key: key,
    child: child,
  );

  final double height;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[
            Theme
                .of(context)
                .primaryColor,
            Theme
                .of(context)
                .primaryColorLight,
          ],
        ),
      ),
    );
  }
}

class _TitleText extends Text {
  const _TitleText(String data, {Key key}) : super(
    data,
    key: key,
    style: const TextStyle(
      color: Colors.white,
      fontSize: 16,
    ),
  );
}
