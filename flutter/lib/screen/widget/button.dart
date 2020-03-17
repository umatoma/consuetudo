import 'package:flutter/material.dart';

class PrimaryButton extends RaisedButton {
  const PrimaryButton({
    Key key,
    @required VoidCallback onPressed,
    Widget child,
  }) : super(
          key: key,
          onPressed: onPressed,
          child: child,
        );
}

class SecondaryButton extends OutlineButton {
  const SecondaryButton({
    Key key,
    @required VoidCallback onPressed,
    Widget child,
  }) : super(
    key: key,
    onPressed: onPressed,
    child: child,
  );
}

class ConfirmButton extends PrimaryButton {
  const ConfirmButton({
    Key key,
    @required VoidCallback onPressed,
  }) : super(
          key: key,
          onPressed: onPressed,
          child: const Text('決定'),
        );
}

class CancelButton extends SecondaryButton {
  const CancelButton({
    Key key,
    @required VoidCallback onPressed,
  }) : super(
          key: key,
          onPressed: onPressed,
          child: const Text('キャンセル'),
        );
}
