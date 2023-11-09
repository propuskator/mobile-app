import {  Alert }                           from 'react-native';
import api                                  from '../apiSingleton';
import toast                                from '../utils/Toast';
import { checkBiometricPermission }         from '../utils/TouchId';
import {
    ERROR_TITLE,
    USER_ACCESS_FORBIDDEN
}                                           from '../utils/validation/errors';
import sessionManager                       from '../SessionManager';
import config                               from '../config';

import {
    withNoConnectErrorRequest,
    withAbbortedErrorRequest,
    showNoConnectErrorAlert
}                                           from '../utils/connectionHelper';
import { dumpUser }                         from '../utils/dumps/userData';
import * as NavigationHelper                from '../utils/NavigationHelper';

import screens                                from '../new-assets/constants/screens';
import { setAppUrls } from '../utils/urlSettings';
import {
    disableBiometric,
    enableBiometric
}                                           from './users';

import { disconnectFromBroker }             from './homie/connection';

import {
    setBrokerConnectionAndFetchData,
    manageConnectionNotification
}                                           from './connection';
import { stopProcessing }                   from './accessPoints';


export const CREATE_SESSION_START   = 'CREATE_SESSION_START';
export const CREATE_SESSION_STOP    = 'CREATE_SESSION_STOP';

export const CHECK_SESSION_SUCCESS  = 'CHECK_SESSION_SUCCESS';
export const UPDATE_SESSION_ERROR   = 'UPDATE_SESSION_ERROR';
export const CHECK_SESSION          = 'CHECK_SESSION';
export const LOGOUT                 = 'LOGOUT';
export const SET_JWT_FROM_STORAGE   = 'SET_JWT_FROM_STORAGE';
export const USER_STATE_INITIALIZED = 'USER_STATE_INITIALIZED';
export const SET_NAVIGATION_STATE   = 'SET_NAVIGATION_STATE';

export function handleSessionError(error, onError) {
    return async dispatch => {
        const isForbidden = error.type === 'forbidden';

        withAbbortedErrorRequest(error);
        if (isForbidden) {
            Alert.alert(
                ERROR_TITLE(),
                USER_ACCESS_FORBIDDEN()
            );
            dispatch(disableBiometric());
            await dispatch(logout());
        }
        if (onError) onError(error);
    };
}

export function loginRequest({ data: sessionData, isRequestBiometric, onError }) {
    return async dispatch => {
        dispatch(startLoginLoading());

        try {
            const { data, meta } = await api.sessions.create(sessionData);

            const dumpedData = dumpUser({
                email     : sessionData.email,
                workspace : sessionData.workspace,
                ...(data?.jwt) ? { jwt: data?.jwt } : {},
                ...(meta?.jwt) ? { jwt: meta?.jwt } : {},
                ...(data?.accessSubject) ? data?.accessSubject : {}
            });

            await dispatch(authenticate({
                newUser : dumpedData,
                isRequestBiometric
            }));
            dispatch(stopLoginLoading());
        } catch (error) {
            console.log('Create session error: ', error);
            dispatch(stopLoginLoading());

            await dispatch(handleSessionError(error, onError));
            withNoConnectErrorRequest(error);
            throw error;
        }
    };
}

export function authenticate({  newUser, isRequestBiometric }) {
    return async dispatch => {
        const activeUser =  sessionManager.getActiveUser();
        const isUserWasLogedIn = activeUser?.isAuthenticated;

        if (newUser.isUserDataExist) {
            await sessionManager.authenticateMultiUser({
                data : newUser,
                url  : config.API_URL
            });

            if (isUserWasLogedIn)  dispatch(checkSessionForSwitchSuccess());
            else dispatch(checkSessionSuccess());
        } else {
            await sessionManager.authenticateUser({
                data : newUser,
                url  : config.API_URL
            });

            if (isUserWasLogedIn)  dispatch(checkSessionForSwitchSuccess());
            else dispatch(checkSessionSuccess());
        }
        const jwt = newUser.jwt;

        if (isRequestBiometric && jwt) {
            await dispatch(disableBiometric());
            await dispatch(enableBiometric());
        }
    };
}

function startLoginLoading() {
    return { type: CREATE_SESSION_START };
}

function stopLoginLoading() {
    return { type: CREATE_SESSION_STOP };
}

export function checkSession() {
    return async dispatch => {
        const isBiometricAvailable = await checkBiometricPermission();

        try {
            const localJwt =  sessionManager.getActiveUser().jwt;

            if (isBiometricAvailable) {
                await dispatch(enableBiometric());
            } else dispatch({ type: CHECK_SESSION });

            if (localJwt) {
                dispatch(startLoginLoading());
                const { data, meta } = await api.sessions.create({ token: localJwt });

                const dumpedData = dumpUser({
                    ...(data?.jwt) ? { jwt: data?.jwt } : {},
                    ...(meta?.jwt) ? { jwt: meta?.jwt } : {},
                    ...(data?.accessSubject) ? data?.accessSubject : {}
                });

                await sessionManager.checkSessionSuccess(dumpedData);

                dispatch(checkSessionSuccess());
                dispatch(stopLoginLoading());
            } else  {
                NavigationHelper.replace(screens.LOGIN);

                dispatch(updateSessionError());
            }
        } catch (error) {
            console.log(error);

            const isNetworkError =  !error.status
            && error.name === 'TypeError'
            && error.message === 'Network request failed';

            if (isNetworkError && isBiometricAvailable) {
                showNoConnectErrorAlert();
                dispatch(stopLoginLoading());
            } else {
                if (!isBiometricAvailable) NavigationHelper.navigate(screens.LOGIN);

                dispatch(updateSessionError());
                dispatch(stopProcessing());
                await dispatch(handleSessionError(error));
                dispatch(manageConnectionNotification());
                console.log('Check session error: ', error);
            }
        }
    };
}

function switchWithBiometricAvailable(user) {
    return async dispatch => {
        try {
            const currentScreen = NavigationHelper.getCurrentRoute();


            if (currentScreen !== screens.LOGIN)  {
                NavigationHelper.push(screens.LOGIN, {
                    withBackIcon : true,
                    fields       : { user }
                });
            }

            await dispatch(enableBiometric());
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
}

export function checkSessionForUserSwitch(user) {
    return async dispatch => {
        const isBiometricAvailable = await checkBiometricPermission();

        try {
            if (isBiometricAvailable) await dispatch(switchWithBiometricAvailable(user));
            else  dispatch({ type: CHECK_SESSION });

            if (user.jwt) {
                dispatch(startLoginLoading());

                setAppUrls(user.url);
                const { data, meta } = await api.sessions.create({ token: user.jwt });
                const dumpedData = dumpUser({
                    ...(data?.jwt) ? { jwt: data?.jwt } : {},
                    ...(meta?.jwt) ? { jwt: meta?.jwt } : {},
                    ...(data?.accessSubject) ? data?.accessSubject : {}
                });

                sessionManager.changeUserSuccess({
                    user : {
                        ...user,
                        ...dumpedData
                    }
                });
                await dispatch(checkSessionForSwitchSuccess());
                dispatch(stopLoginLoading());
            } else  forbiddenError(user);
        } catch (error) {
            const isForbidden = error.type === 'forbidden';
            const isNetworkError =  !error.status
            && error.name === 'TypeError'
            && error.message === 'Network request failed';

            if (isForbidden) {
                forbiddenError(user);
            }
            if (isForbidden || isNetworkError)  sessionManager.setPreviousSettings();

            dispatch(stopLoginLoading());
            withNoConnectErrorRequest(error);

            dispatch(stopProcessing());

            dispatch(manageConnectionNotification());
            console.log('Check session error: ', error);

            throw error;
        }
    };
}

async function forbiddenError(user) {
    Alert.alert(
        ERROR_TITLE(),
        USER_ACCESS_FORBIDDEN()
    );
    await sessionManager.discardUserChange(user);
}

export function checkSessionForSwitchSuccess() {
    return async dispatch => {
        NavigationHelper.reset(screens.TAB_NAVIGATION, { screen: screens.ACCESS_POINTS });

        dispatch({ type: LOGOUT });

        await dispatch(disconnectFromBroker());
        dispatch(setBrokerConnectionAndFetchData());

        dispatch({
            type : CHECK_SESSION_SUCCESS
        });
    };
}


// export function switchAccountsError(user) {
//     return (dispatch) => {
//         sessionManager.setPreviousSettings();
//         // sessionManager.removeUser({
//         //     url : user.url,
//         //     id  : user.id
//         // });


//         dispatch({
//             type : UPDATE_SESSION_ERROR
//         });
//     };
// }


export function checkSessionSuccess() {
    return dispatch => {
        NavigationHelper.replace(screens.TAB_NAVIGATION, { screen: screens.ACCESS_POINTS });
        dispatch(setBrokerConnectionAndFetchData());

        dispatch({
            type : CHECK_SESSION_SUCCESS
        });
    };
}

export function updateSessionError() {
    sessionManager.checkSessionError();

    return dispatch => {
        dispatch({
            type : UPDATE_SESSION_ERROR
        });
        dispatch(stopLoginLoading());
    };
}

export function setNavigationInitState() {
    return {
        type : SET_NAVIGATION_STATE
    };
}


export function logout({ withAccountSwitch  } = { withAccountSwitch: true }) {
    return async dispatch => {
        dispatch({ type: LOGOUT });

        const isBiometricAvailable = await checkBiometricPermission();

        if (withAccountSwitch) {
            try {
                const { user, isLast } = await sessionManager.logoutWithAccountSwitch(isBiometricAvailable);

                if (!isLast) {
                    await dispatch(checkSessionForUserSwitch(user));
                    NavigationHelper.navigate(screens.ACCESS_POINTS);
                } else  {
                    NavigationHelper.replace(screens.LOGIN);
                    // await dispatch(disableBiometric());
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            await sessionManager.logout(isBiometricAvailable);

            NavigationHelper.navigate(screens.LOGIN);
        }


        dispatch(disconnectFromBroker());
    };
}

export function forbiddenLogout() {
    return  async dispatch => {
        await dispatch(logout());
        const isMultiUserEnabled =  sessionManager.isMultiUserEnabled();

        if (!isMultiUserEnabled) dispatch(disableBiometric());

        toast.show(USER_ACCESS_FORBIDDEN(), 2);
    };
}

export function initilizeUserState() {
    return {
        type : USER_STATE_INITIALIZED
    };
}
