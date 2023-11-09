/* eslint-disable func-style */
import i18n             from '../i18n/index';

export const ERROR_TITLE =   () => i18n.t('Error');
export const INFO_TITLE =   () => i18n.t('Info');
export const TIMEOUT_ERROR_TITLE =   () => i18n.t('Timeout error');


export  const BIOMETRIC_ERRORS = {
    LAErrorTouchIDLockout       : () => i18n.t('Authentication failed because of too many failed attempts.'),
    RCTTouchIDUnknownError      : () => i18n.t('Could not authenticate for an unknown reason.'),
    LAErrorAuthenticationFailed : () => i18n.t('Authentication was not successful because the user failed to provide valid credentials.')
};

export const touchIdSettings = (biometryType) => i18n.t('touchIdSettingError', { biometryType });

export const ACCESS_POINTS_ERRORS = {
    acessDenied : () => i18n.t('Access denied. Try again later'),
    timeout     : () => i18n.t('Something went wrong. Can\'t establish connection with access point')
};

export const INVALID_RESPONSE_ERROR = () => i18n.t('Invalid response from server. Please check your URL settings');
export const NETWORK_ERROR = () => i18n.t('Cannot establish connection with server. Please check your URL settings and internet connection and try again');
export const USER_ACCESS_FORBIDDEN = () => i18n.t('Access is forbidden');
export const TIMEOUT_ERROR = () => i18n.t('Please check your URL settings and internet connection');


export const REQUIRED_ERRORS = {
    email           : () => i18n.t('Email is required'),
    password        : () => i18n.t('Password is required'),
    passwordConfirm : () => i18n.t('Password confirmation is required'),
    workspace       : () => i18n.t('Workspace is required'),
    ipAdress        : () => i18n.t('Server URL is required'),
    name            : () => i18n.t('Required field')
};

export const TOO_SHORT_ERRORS = {
    password : () => i18n.t('Password must contain at least 6 symbols'),
    code     : () => i18n.t('Code must contain 6 symbols')
};

export const WRONG_FORMAT_ERRORS = {
    password : () => i18n.t('Password must be characters (A-z), digits (0-9)'),
    id       : () => i18n.t('Tag ID must be an integer')
};

export const NOT_ALLOWED_VALUE = {
    privacyPolicy : () => i18n.t('Confirmation and agreement with Privacy Policy and Terms of use are required')
};
