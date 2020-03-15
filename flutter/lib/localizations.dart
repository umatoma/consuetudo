import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AppLocalizations {
  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {

  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return <String>['ja'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    assert(isSupported(locale));
    final String localeName = Intl.canonicalizedLocale(locale.toString());
    Intl.defaultLocale = localeName;
    return AppLocalizations();
  }

  @override
  bool shouldReload(_) {
    return false;
  }
}