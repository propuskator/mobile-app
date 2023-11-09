import smartHome                     from '../../smartHome';
import { manageConnectionNotification } from '../connection';
import {
    isBrokerConnectedSelector,
    isInternetConnectedSelector
} from '../../selectors/connection';
import { getMqttCreds } from '../users';
import {
    dismissMessage
}                                    from '../snackbar';
import config                        from '../../config';
import {
    getDevices
}                                    from './homie';


export const CONNECT_LOST    = 'CONNECT_LOST';
export const CONNECT_RESTORE = 'CONNECT_RESTORE';
export const CONNECT_REQUEST = 'CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS';
export const CONNECT_ERROR   = 'CONNECT_ERROR';
export const DISCONNECT      = 'DISCONNECT';
export const INITIAL_CONNECT_TIMEOT = 10000;


export function handleBrokerConnectionLost() {
    return async (dispatch) => {
        await dispatch({ type: CONNECT_LOST });

        dispatch(manageConnectionNotification());
    };
}

export function handleBrokerConnectionRestored() {
    return async dispatch => {
        await dispatch({ type: CONNECT_RESTORE });
        dispatch(manageConnectionNotification());
    };
}

async function disconnectBroker() {
    try {
        await smartHome.disconnect();
    } catch (error) {
        // pass error
    }
}

export function connectRequest({ data, onError, withDisconnect }) {
    return async (dispatch) => {
        try {
            const errorTimeout = setTimeout(() => {
                dispatch({ type: CONNECT_ERROR });
            }, INITIAL_CONNECT_TIMEOT);

            if (withDisconnect) await disconnectBroker();

            const result = await smartHome.connect(data, onError);

            if (withDisconnect) dispatch(getDevices());

            clearTimeout(errorTimeout);

            return result;
        } catch (error) {
            console.log('Connect error', error);


            throw (error);
        }
    };
}


export function setBrokerConnection({ isForceUpdate = false } = {}) {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const isConnected = isBrokerConnectedSelector(state);
            const isInternetReachable  = isInternetConnectedSelector(state);

            if (isInternetReachable && (!isConnected || isForceUpdate)) {
                dispatch({ type: CONNECT_REQUEST });

                const mqttCredentials = await dispatch(getMqttCreds());

                const {
                    username,
                    password,
                    syncMaxDelay,
                    syncResetTimeout
                } = mqttCredentials;

                if (mqttCredentials && username && password) {
                    const brokerUrl = config.BROKER_URL;

                    await dispatch(connectRequest({
                        withDisconnect : isConnected,
                        data           : {
                            brokerUrl,
                            username,
                            password,
                            syncMaxDelay,
                            syncResetTimeout
                        }
                    }));
                }
                dispatch({ type: CONNECT_SUCCESS });
            }
        } catch (error) {
            console.log('Connect error', error);

            dispatch({ type: CONNECT_ERROR });

            throw (error);
        }
    };
}

function hideBrockerDisconnectMessage() {
    return async (dispatch, getState) => {
        const state = getState();
        const isInternetConnected = isInternetConnectedSelector(state);
        const isBrokerConnected = isBrokerConnectedSelector(state);

        if (!isBrokerConnected && isInternetConnected) {
            dispatch(dismissMessage());
        }
    };
}

export function disconnectFromBroker() {
    return async dispatch => {
        try {
            smartHome.disconnect();

            dispatch(hideBrockerDisconnectMessage());
            dispatch({ type: DISCONNECT });
        } catch (e) {
            console.log('Disconnect error', e);
        }
    };
}

