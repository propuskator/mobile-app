import {
    isConnectingAfterBackgroundSelector,
    isBrokerConnectedSelector,
    isInternetConnectedSelector,
    isAppInBackgroundSelector

}  from '../selectors/connection';
import i18n                             from '../utils/i18n';
import {
    isUserLogedInSelector,
    isUserNotLogedInSelector
} from '../selectors/session';
import { showMessage, dismissMessage }  from './snackbar';
import { setBrokerConnection } from './homie/connection';
import { getDevices } from './homie/homie';
import { siriQueue } from './accessPoints';
import { checkSession } from './session';

export const APP_SWITCH_TO_BACKGROUND           = 'APP_SWITCH_TO_BACKGROUND';
export const NETWORK_STATUS_UPDATE              = 'NETWORK_STATUS_UPDATE';
export const NO_CONNECT_SCREEN_UPDATE           = 'NO_CONNECT_SCREEN_UPDATE';
export const CONNECTING_AFTER_BACKGROUND_UPDATE = 'CONNECTING_AFTER_BACKGROUND_UPDATE';
export const TRYING_TO_CONNECT_UPDATE           = 'TRYING_TO_CONNECT_UPDATE';

export const DISCONNECT_MESSAGE_TIMEOUT         = 2000;

let noConnectionTimeout;


export function  manageConnectionNotification() {
    return  (dispatch, getState) => {
        const state = getState();
        const isInternetConnected = isInternetConnectedSelector(state);
        const isBrokerConnected = isBrokerConnectedSelector(state);
        const isAfterBackground = isConnectingAfterBackgroundSelector(state);
        const isUserLoggedIn = isUserLogedInSelector(state);
        const isUserNotLoggedIn = isUserNotLogedInSelector(state);

        const shouldErrorMessageBeShown = isUserNotLoggedIn
            ? !isInternetConnected
            : (isUserLoggedIn && !isAfterBackground &&
                (!isInternetConnected || !isBrokerConnected));

        clearTimeout(noConnectionTimeout);

        noConnectionTimeout = setTimeout(
            () => dispatch(
                shouldErrorMessageBeShown
                    ? showLostConnectionScreen()
                    : dismissLostConnectionScreen()
            ), DISCONNECT_MESSAGE_TIMEOUT);
    };
}

export function showLostConnectionScreen() {
    return async (dispatch, getState) => {
        const state = getState();
        const isAppInBackground = isAppInBackgroundSelector(state);

        if (!isAppInBackground) {
            await dispatch(updateNoConnectScreenStatus(true));
            dispatch(showMessage({ type: 'error', message: i18n.t('Trying to connect') }));
        }
    };
}

function dismissLostConnectionScreen() {
    return async dispatch => {
        dispatch(updateNoConnectScreenStatus(false));

        dispatch(dismissMessage());
    };
}


export function updateNoConnectScreenStatus(value) {
    return {
        type    : NO_CONNECT_SCREEN_UPDATE,
        payload : {
            isNoConnectScreenVisible : value
        }
    };
}

export function networkStatusUpdated({ isInternetReachable }) {
    return async (dispatch, getState) => {
        const state = getState();
        const previousIsInternetReachable = isInternetConnectedSelector(state);
        const isNetworkStatusChanged = previousIsInternetReachable !== isInternetReachable
                                     && isInternetReachable !== null;
        const  isSessionExist  = state.session.isSessionExist;

        if (isNetworkStatusChanged) {
            dispatch({
                type    : NETWORK_STATUS_UPDATE,
                payload : {
                    isInternetReachable
                }
            });
            if (isInternetReachable && !isSessionExist)  dispatch(checkSession());

            dispatch(manageConnectionNotification());
        }
    };
}

export function updateTryingToConnectStatus({ isTryingToConnectVisible }) {
    return {
        type    : TRYING_TO_CONNECT_UPDATE,
        payload : {
            isTryingToConnectVisible
        }
    };
}


export function setBrokerConnectionAndFetchData() {
    return async dispatch => {
        try {
            // await dispatch(getAccessPoints());
            await dispatch(setBrokerConnection());
            await dispatch(getDevices());
            siriQueue.reduce();
        } catch (err) {
            console.log(err);
        }
    };
}

export function updateStateAfterBackgroundSwitch({ isConnectingAfterBackground }) {
    return async (dispatch, getState) => {
        const state = getState();
        const { isConnected } = state.homieConnection;


        await dispatch({
            type    : CONNECTING_AFTER_BACKGROUND_UPDATE,
            payload : {
                isConnectingAfterBackground
            }
        });
        if (isConnected && isConnectingAfterBackground)  siriQueue.reduce();
        // dispatch(manageConnectionNotification());
    };
}

export function updateAppState() {
    return {
        type : APP_SWITCH_TO_BACKGROUND
    };
}
