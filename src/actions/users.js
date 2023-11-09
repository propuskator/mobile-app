import { Alert }                            from 'react-native';
import api                                  from '../apiSingleton';
import Storage                              from '../utils/AsyncStorage';
import {
    requestEnableBiometric,
    setBiometricPermission,
    checkIsBiometryWasRequested,
    setIsBiometryWasRequested,
    getBiometryType
}                                           from '../utils/TouchId';
import {
    setHideGroupsToStorage
}                                           from '../utils/storage/Interface';
import {
    ERROR_TITLE,
    BIOMETRIC_ERRORS,
    INFO_TITLE,
    touchIdSettings
}                                           from '../utils/validation/errors';
import {
    withNoConnectErrorRequest
}                                           from '../utils/connectionHelper';
import sessionManager                       from '../SessionManager';
import * as NavigationHelper                from '../utils/NavigationHelper';
import i18n                                 from '../utils/i18n';
import screens                                from '../new-assets/constants/screens';

import { mapMqttCred }                      from '../utils/mapper/mapMqttCreds';
import { dumpUser }                         from '../utils/dumps/userData';

import {
    handleSessionError,
    forbiddenLogout,
    logout,
    initilizeUserState,
    checkSessionForUserSwitch,
    authenticate
}                                           from './session';
import {
    setBrokerConnection
}                                           from './homie/connection';

export const CREATE_USER_REQUEST           = 'CREATE_USER_REQUEST';
export const UPDATE_BIOMETRIC_ENABLE       = 'UPDATE_BIOMETRIC_ENABLE';
export const UPDATE_RESTORE_PASS_WORKSPACE = 'UPDATE_RESTORE_PASS_WORKSPACE';
export const UPDATE_RESTORE_PASS_EMAIL     = 'UPDATE_RESTORE_PASS_EMAIL';
export const UPDATE_RESTORE_PASS_TOKEN     = 'UPDATE_RESTORE_PASS_TOKEN';
export const UPDATE_RESTORE_PASS_CODE      = 'UPDATE_RESTORE_PASS_CODE';
export const SWITCH_ACCOUNT_START          = 'SWITCH_ACCOUNT_START';
export const SWITCH_ACCOUNT_END            = 'SWITCH_ACCOUNT_END';
export const CREATE_REGISTRATION_REQUEST   = 'CREATE_REGISTRATION_REQUEST';


export function createUserRequest({ data:inputData, isRequestBiometric, onSuccess, onError }) {
    return async dispatch => {
        try {
            dispatch({ type: CREATE_USER_REQUEST });
            const { data, meta } = await api.users.create(inputData);
            const jwt = meta.token;

            const dumpedData = dumpUser({
                email     : inputData.email,
                workspace : inputData.workspace,
                ...data?.accessSubject ? data.accessSubject : data,
                jwt
            });

            await dispatch(authenticate({
                newUser : dumpedData,
                isRequestBiometric
            }));
            onSuccess();
        } catch (error) {
            console.log('Create user error: ', error);
            withRegistrationRequestRedirect(error, inputData);
            dispatch(handleSessionError(error, onError));
            withNoConnectErrorRequest(error);

            if (onError) onError(error);
        }
    };
}

function withRegistrationRequestRedirect(
    error,
    {
        email,
        workspace,
        subjectName,
        password,
        passwordConfirm,
        privacyPolicy
    }) {
    if (error.code === 'SUBJECT_NOT_FOUND_IN_WORKSPACE') {
        Alert.alert(
            i18n.t('Registration request'),
            i18n.t('not_registered_alert'),
            [
                {
                    text    : i18n.t('Continue'),
                    onPress : () =>  NavigationHelper.push(screens.REQUEST_REGISTR, {
                        subjectEmail  : email,
                        workspaceName : workspace,
                        subjectName,
                        password,
                        passwordConfirm,
                        privacyPolicy
                    })
                },
                {
                    text : i18n.t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }
}

export function createRegistrationRequest({ data, onSuccess, onError }) {
    return async dispatch => {
        try {
            dispatch({ type: CREATE_REGISTRATION_REQUEST });

            await api.users.createRegistrationRequest(data);

            onSuccess();
        } catch (error) {
            console.log('Create user error: ', error);
            if (onError) onError(error);
            handleRegistrationRequestError(error);
            dispatch(handleSessionError(error, onError));
            withNoConnectErrorRequest(error);
        }
    };
}

export function handleRegistrationRequestError(err) {
    let message = '';

    const errors = {};
    const title =  i18n.t('Sorry');

    switch (err?.code) {
        case 'REGISTRATION_REQUEST_SUBJECT_EMAIL_IS_ALREADY_REGISTERED':
            errors.email = 'Your email is already registered';

            return errors;

        case 'REGISTRATION_REQUEST_SUBJECT_IS_ALREADY_CREATED':
            message = i18n.t('Email is already added to workspace. Please sign in.');

            Alert.alert(
                title,
                message
            );
            break;
        default:
            break;
    }
}


export function updateBiometricSetting(payload) {
    return {
        type : UPDATE_BIOMETRIC_ENABLE,
        payload
    };
}

export function updateUserPassword({ payload, onError, onSuccess }) {
    return async (dispatch, getState) => {
        try {
            const res = await api.users.updatePassword(payload);
            const state = getState();
            const { isBiometricEnable } = state.users;
            const { newToken } = res.meta;

            if (isBiometricEnable) {
                await setBiometricPermission({ biometricToken: newToken });
            }
            const dumpedData = dumpUser({
                jwt : newToken,
                ...res.data
            });

            sessionManager.checkSessionSuccess(dumpedData);
            dispatch(setBrokerConnection({ isForceUpdate: true }));

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            if (error.type === 'forbidden') {
                await dispatch(forbiddenLogout());
            }
            withNoConnectErrorRequest(error);

            if (onError) {
                onError(error);
            }
        }
    };
}


export function enableBiometric({ onError } = {}) {
    return async dispatch => {
        try {
            dispatch(initilizeUserState());
            await requestEnableBiometric();

            dispatch(updateBiometricSetting({
                isBiometricEnable : true
            }));
        } catch (err) {
            const isBiometricWasRequested = await checkIsBiometryWasRequested();
            const supportedErrors = [ 'LAErrorTouchIDLockout', 'RCTTouchIDUnknownError', 'LAErrorAuthenticationFailed' ];
            const { name } = err;

            if (supportedErrors.includes(name)) {
                Alert.alert(
                    ERROR_TITLE(),
                    BIOMETRIC_ERRORS[name]()
                );
            }

            if (err.name === 'LAErrorTouchIDNotAvailable' && isBiometricWasRequested) {
                const biometryType = await getBiometryType();

                Alert.alert(
                    INFO_TITLE(),
                    touchIdSettings(biometryType)
                );
            }
            const iosErrorsToTurnBiometric = [ 'LAErrorTouchIDLockout', 'RCTTouchIDUnknownError', 'LAErrorTouchIDNotAvailable', 'LAErrorTouchIDNotEnrolled' ];
            const androidErrorsToTurnBiometric = [ 'FINGERPRINT_ERROR_LOCKOUT', 'LOCKOUT', 'NOT_AVAILABLE', 'NOT_ENROLLED', 'AUTHENTICATION_FAILED', 'SYSTEM_CANCELED', 'NOT_AVAILABLE' ];
            const isIosError = iosErrorsToTurnBiometric.includes(err.name);
            const isAndroidError = androidErrorsToTurnBiometric.includes(err.code);

            if (isIosError || isAndroidError) await dispatch(disableBiometric());
            if (supportedErrors.includes(name)) {
                Alert.alert(
                    ERROR_TITLE(),
                    BIOMETRIC_ERRORS[name]()
                );
            }
            if (onError) onError();
            throw err;
        } finally {
            await setIsBiometryWasRequested(true);
        }
    };
}
export function disableBiometric() {
    return async dispatch => {
        await setBiometricPermission({ isEnable: null, biometricToken: '' });
        dispatch(updateBiometricSetting({
            isBiometricEnable : null
        }));
    };
}

export function updateRestorePasswordWorkspace(workspace) {
    return {
        type    : UPDATE_RESTORE_PASS_WORKSPACE,
        payload : { workspace }
    };
}

export function updateRestorePasswordEmail(email) {
    return {
        type    : UPDATE_RESTORE_PASS_EMAIL,
        payload : { email }
    };
}

export function updateRestorePasswordToken(token) {
    return {
        type    : UPDATE_RESTORE_PASS_TOKEN,
        payload : { token }
    };
}

export function updateRestorePasswordCode(code) {
    return {
        type    : UPDATE_RESTORE_PASS_CODE,
        payload : { code }
    };
}

export function requestResetPassword({ email, workspace, onSuccess, onError }) {
    return async () => {
        try {
            const res = await api.users.resetPasswordEmail({ email, workspace });

            const { passwordResetTokentoken } = res.data;

            onSuccess(passwordResetTokentoken);
        } catch (error) {
            console.log(error);
            withNoConnectErrorRequest(error);
            onError({ error });
        }
    };
}

export function validateResetCode({ code, token, onSuccess, onError }) {
    return async () => {
        try {
            await api.users.resetPasswordCode({ token, code });

            onSuccess();
        } catch (error) {
            onError({ error });
        }
    };
}

export function resetPassword({ payload, onSuccess, onError }) {
    return async () => {
        try {
            const res = await api.users.resetPassword(payload);
            const { newToken } = res.meta;

            onSuccess({ newToken, accessSubject: res?.data?.accessSubject });
        } catch (error) {
            onError({ error });
        }
    };
}

export function getMqttCreds() {
    return async () => {
        try {
            const res = await api.users.getMqtt();
            const mappedData = mapMqttCred(res.data);

            return mappedData;
        } catch (error) {
            console.log('getMqttCreds', error);
            throw error;
        }
    };
}

export function removeUserAccount() {
    return async dispatch => {
        try {
            await api.users.removeUser();
            await Storage.setItem('email', '');
            await Storage.setItem('workspace', '');
            await dispatch(disableBiometric());
            await dispatch(logout());
        } catch (error) {
            withNoConnectErrorRequest(error);
            console.log('Remove account error', error);
        }
    };
}


export function switchAccount({ id, url, onSuccess, onError }) {
    return async dispatch => {
        try {
            dispatch({
                type : SWITCH_ACCOUNT_START
            });
            const data = sessionManager.getDataByUser({ id, url });

            if (data) {
                await dispatch(checkSessionForUserSwitch(data));
            }
            onSuccess();
        } catch (error) {
            onError(error);
            console.log('Switch  account error', error);
        } finally {
            dispatch({
                type : SWITCH_ACCOUNT_END
            });
        }
    };
}

export const UPDATE_HIDE_GROUPS = 'UPDATE_HIDE_GROUPS';

export function toggleHigeGroups(hideGroups) {
    return async dispatch => {
        try {
            dispatch({
                type    : UPDATE_HIDE_GROUPS,
                payload : {
                    hideGroups
                }
            });
            setHideGroupsToStorage(hideGroups);
        } catch (error) {
            console.log('Toggle hide groups error', error);
        }
    };
}
