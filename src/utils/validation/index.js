/* eslint-disable camelcase*/

import LIVR             from 'livr';
import extraRules       from 'livr-extra-rules';
import i18n             from '../i18n/index';
import rules            from './rules';
import {
    REQUIRED_ERRORS,
    TOO_SHORT_ERRORS,
    WRONG_FORMAT_ERRORS,
    NOT_ALLOWED_VALUE
} from './errors';

LIVR.Validator.registerDefaultRules(extraRules);

LIVR.Validator.defaultAutoTrim(true);


function validate({ rule, data, onSuccess, onError }) {
    const validator = new LIVR.Validator(rule);

    const validData = validator.validate(data);

    if (validData) {
        if (onSuccess) onSuccess(validData);
    } else {
        const decodedErrors = decodeErrorObject(validator.getErrors());

        if (onError) onError(decodedErrors);
    }
}

export function validateConnect(args) {
    return validate({ rule: rules.connect, ...args });
}
export function validateCreateSession(args) {
    return validate({ rule: rules.createSession, ...args });
}

export function validateRegistration(args) {
    return validate({ rule: rules.registration, ...args });
}

export function validateRegistrationRequest(args) {
    return validate({ rule: rules.requestRegistration, ...args });
}

export function validateCredentials(args) {
    return validate({ rule: rules.credentials, ...args });
}

export function validateWorkspace(args) {
    return validate({ rule: rules.workspace, ...args });
}

export function validateReportText(args) {
    return validate({ rule: rules.report, ...args });
}

export function validateIp({ url, onSuccess, onError }) {
    const isUrlValid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);

    if (isUrlValid) {
        if (onSuccess) onSuccess({ ipAdress: url });
    } else if (onError) {
        onError({
            ipAdress : url.trim().length
                ? i18n.t('Not valid URL adress')
                : i18n.t('Server URL is required')
        });
    }
}

export function validateChangePassword(args) {
    return validate({ rule: rules.changePassword, ...args });
}

export function validateRestorePasswordEmail(args) {
    return validate({ rule: rules.restorePassword.email, ...args });
}

export function validateRestorePasswordCode(args) {
    return validate({ rule: rules.restorePassword.code, ...args });
}

export function validateRestorePasswordNewPass(args) {
    return validate({ rule: rules.restorePassword.password, ...args });
}

export function validateAttachSubjectToken(args) {
    return validate({ rule: rules.subjectTokens, ...args });
}

export function validatePointNameValue(args) {
    return validate({ rule: rules.renamePoint, ...args });
}

export function validateEditInput(args) {
    return validate({ rule: rules.editInput, ...args });
}

export function validateReaderGroup(args) {
    return validate({ rule: rules.readerGroup, ...args });
}

export function mapErrors(error) {
    const mapedErrors = { };
    const TOO_MANY_REQURSTS = [ 'HTTP_TOO_MANY_REQUESTS_FOR_LOGIN', 'HTTP_TOO_MANY_REQUESTS_FOR_USER_REGISTRATION' ];

    if (TOO_MANY_REQURSTS.includes(error.code)) {
        return {
            email : error.message
        };
    }

    error.errors?.forEach(element => mapedErrors[element.field] = element.message); /* eslint-disable-line no-unused-expressions, max-len */

    return mapedErrors;
}

function decodeErrorObject(errors) {
    const decodedErrors = { ...errors };

    for (const field in decodedErrors) {
        if (decodedErrors.hasOwnProperty(field)) {
            const errorField = field.replace('data/', '');

            decodedErrors[errorField] = decodeErrorCode(decodedErrors[field], errorField);
        }
    }

    return decodedErrors;
}

export function decodeErrorCode(code, field = '') {
    switch (code) {
        case 'REQUIRED': {
            const errorMessage = field && REQUIRED_ERRORS[field] && REQUIRED_ERRORS[field]();


            return errorMessage || i18n.t('Required');
        }
        case 'TOO_SHORT': {
            const errorMessage = field && TOO_SHORT_ERRORS[field] && TOO_SHORT_ERRORS[field]();

            return errorMessage || i18n.t('Value is too short');
        }
        case 'WRONG_FORMAT':
        case 'NOT_INTEGER': {
            const errorMessage = field && WRONG_FORMAT_ERRORS[field] && WRONG_FORMAT_ERRORS[field]();

            return errorMessage || i18n.t('Value has a wrong format');
        }
        case 'NOT_ALLOWED_VALUE': {
            return NOT_ALLOWED_VALUE[field]();
        }
        case 'WRONG_EMAIL':
            return i18n.t('Wrong email format');
        case 'FIELDS_NOT_EQUAL':
            return i18n.t('Passwords are not equal');
        case 'NOT_UNIQUE':
            return i18n.t('Email is already in use');
        case 'NOT_IP':
            return i18n.t('Not valid URL adress');

        default:
            return code;
    }
}

