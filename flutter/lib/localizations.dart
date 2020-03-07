import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AppLocalizations {
  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {

  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['ja'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    assert(isSupported(locale));
    final localeName = Intl.canonicalizedLocale(locale.toString());
    Intl.defaultLocale = localeName;
    return AppLocalizations();
  }

  @override
  bool shouldReload(LocalizationsDelegate old) {
    return false;
  }
}