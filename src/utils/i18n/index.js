import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import Storage            from '../AsyncStorage';

import enTranslations from './locales/en/translation.json';
import ruTranslations from './locales/ru/translation.json';
import uaTranslations from './locales/uk/translation.json';

export const LANGUAGES = {
    RU : 'ru',
    EN : 'en',
    UK : 'uk'
};

export const LANGUAGES_ARRAY = [ 'ru', 'en', 'uk' ];
export const FALBACK_LANGUAGE = 'en';

export const RESOURCES = {
    [LANGUAGES.EN] : {
        'translation' : enTranslations
    },
    [LANGUAGES.RU] : {
        'translation' : ruTranslations
    },
    [LANGUAGES.UK] : {
        'translation' : uaTranslations
    }
};


// eslint-disable-next-line func-style
export const detectLanguage = async () => {
    const localLanguage = await Storage.getItem('APP_LANG') || null;


    if (localLanguage) return (localLanguage);

    const bestLng =  RNLocalize.findBestAvailableLanguage(LANGUAGES_ARRAY);

    return  bestLng?.languageTag || FALBACK_LANGUAGE;
};

const languageDetector = {
    type   : 'languageDetector',
    async  : true, // async detection
    detect : async (cb) => {
        const lng = await detectLanguage();

        cb(lng);
    },
    init              : () => {},
    cacheUserLanguage : () => {}
};


i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        resources         : RESOURCES,
        supportedLngs     : LANGUAGES_ARRAY,
        fallbackLng       : 'en',
        keySeparator      : false,
        returnEmptyString : false,
        interpolation     : {
            escapeValue : false
        },
        react : {
            useSuspense : false
        }

    });

export default i18n;
