import i18next from 'i18next';
import { locale } from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fil from './locales/fil.json';
import ar from './locales/ara.json';
import hi from './locales/hin.json';
import kn from './locales/kan.json';
import ta from './locales/tam.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = { en, fil, ar, hi, kn, ta };
import { iso6393To1, iso6393To2T } from 'iso-639-3';
import { LocalizedField } from './types/vc';

const languageCodeMap = {};

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fil: 'Filipino',
  ar: 'عربى',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்',
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLanguageCode(locale),
    fallbackLng: getLanguageCode,
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  })
  .then(async () => {
    const language = await AsyncStorage.getItem('language');
    if (language !== i18next.language) {
      i18next.changeLanguage(language);
      populateLanguageCodeMap();
    }
  });

export default i18next;

function getLanguageCode(code: string) {
  const [language] = code.split('-');
  return language;
}

export function getVCDetailsForCurrentLanguage(locales) {
  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES);
  const currentLanguage = i18next.language;
  for (const index in supportedLanguages) {
    const supportedLanguage = supportedLanguages[index];
    if (supportedLanguage == currentLanguage) {
      const vcDetailsForCurrentLanguage = locales.filter(
        (obj) => obj.language === languageCodeMap[currentLanguage]
      );
      return vcDetailsForCurrentLanguage[0]?.value
        ? vcDetailsForCurrentLanguage[0].value
        : locales[0]?.value;
    }
  }
}

// This method gets the value from iso-639-3 package, which contains key value pairs of three letter language codes[key] and two letter langugae code[value]. These values are according to iso standards.
// The response recieved from the server is three letter language code and the value in the inji code base is two letter language code. Hence the conversion is done.
function getThreeLetterLanguageCode(twoLetterLanguageCode) {
  let threeLetterLanguageCode = Object.keys(iso6393To1).find(
    (key) => iso6393To1[key] === twoLetterLanguageCode
  );
  if (!threeLetterLanguageCode) {
    threeLetterLanguageCode = Object.keys(iso6393To2T).find(
      (key) => iso6393To2T[key] === twoLetterLanguageCode
    );
  }
  return threeLetterLanguageCode;
}

function populateLanguageCodeMap() {
  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES);
  supportedLanguages.forEach((twoLetterLanguageCode) => {
    return (languageCodeMap[twoLetterLanguageCode] = getThreeLetterLanguageCode(
      twoLetterLanguageCode
    ));
  });
}

export function getLocalizedField(rawField: string | LocalizedField[]) {
  if (typeof rawField === 'string') {
    return rawField;
  }
  try {
    const locales: LocalizedField[] = JSON.parse(JSON.stringify(rawField));
    if (locales.length == 1) return locales[0]?.value;
    return getVCDetailsForCurrentLanguage(locales);
  } catch (e) {
    return '';
  }
}
