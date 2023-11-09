import config from '../config';
import i18n   from './i18n/index';

export function constructCloseToggleShortcut({ topic, name }) {
    const siriTitle =  i18n.t('siriCloseTitle', { name });

    return ({
        key            : `${topic}close`,
        title          : siriTitle,
        shortcutOption : {
            isEligibleForSearch       : true,
            isEligibleForPrediction   : true,
            isEligibleForHandoff      : true,
            needsSave                 : true,
            activityType              : `${config.BUNDLE_ID}.close${topic}`,
            persistentIdentifier      : `${topic}FalseValue`,
            title                     : siriTitle,
            suggestedInvocationPhrase : siriTitle,
            userInfo                  : {
                topic,
                value           : 'false',
                accessPointName : name
            }
        }
    });
}

export function constructOpenToggleShortcut({ topic, name }) {
    const siriTitle =  i18n.t('siriOpenTitle', { name });

    return ({
        key            : `${topic}open`,
        title          : siriTitle,
        shortcutOption : {
            isEligibleForSearch       : true,
            isEligibleForPrediction   : true,
            isEligibleForHandoff      : true,
            needsSave                 : true,
            activityType              : `${config.BUNDLE_ID}.open${topic}`,
            persistentIdentifier      : `${topic}TrueValue`,
            title                     : siriTitle,
            suggestedInvocationPhrase : siriTitle,
            userInfo                  : {
                topic,
                value           : 'true',
                accessPointName : name
            }
        }
    });
}

export function getShortcuts(data) {
    return [ constructOpenToggleShortcut(data), constructCloseToggleShortcut(data) ];
}
