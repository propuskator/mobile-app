import i18n             from '../utils/i18n/index';


export const HOMIE_ERROR_MAP = {
    ERROR       : 'ERROR',
    VALIDATION  : 'VALIDATION',
    TIMEOUT     : 'TIMEOUT',
    DENIED      : 'Denied',
    WRONG_VALUE : 'WRONG_VALUE'
};

const HOMIE_ERROR_TITLE = {
    [HOMIE_ERROR_MAP.ERROR]       : () => i18n.t('Error'),
    [HOMIE_ERROR_MAP.VALIDATION]  : () => i18n.t('Validation error'),
    [HOMIE_ERROR_MAP.WRONG_VALUE] : () => i18n.t('Validation error'),
    [HOMIE_ERROR_MAP.TIMEOUT]     : () => i18n.t('Timeout error'),
    [HOMIE_ERROR_MAP.DENIED]      : () => i18n.t('Error')
};

export const HOMIE_ERROR_MESSAGE = {
    [HOMIE_ERROR_MAP.ERROR]       : () => i18n.t('Unknown error'),
    [HOMIE_ERROR_MAP.VALIDATION]  : () => i18n.t('Attribute validation error'),
    [HOMIE_ERROR_MAP.WRONG_VALUE] : () => i18n.t('Attribute validation error'),
    [HOMIE_ERROR_MAP.TIMEOUT]     : () => i18n.t('Something went wrong. Please, try again later'),
    [HOMIE_ERROR_MAP.DENIED]      : () => i18n.t('Access denied')

};

export function getHomieErrorTitle(code = '') {
    const message = HOMIE_ERROR_TITLE[code]()
        ? HOMIE_ERROR_TITLE[code]()
        : `${code.charAt(0).toUpperCase()}${code.slice(1).replace(/_/g, ' ').toLowerCase()}`;

    return message;
}
