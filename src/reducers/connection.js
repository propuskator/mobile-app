import produce from 'immer';
import {
    NETWORK_STATUS_UPDATE,
    CONNECTING_AFTER_BACKGROUND_UPDATE,
    TRYING_TO_CONNECT_UPDATE,
    NO_CONNECT_SCREEN_UPDATE,
    APP_SWITCH_TO_BACKGROUND
} from '../actions/connection';

import {
    CONNECT_SUCCESS,
    DISCONNECT
} from '../actions/homie/connection';

import {
    UPDATE_HOMIE_STATE
} from '../actions/homie/homie';


const initialState = {
    isAppInBackground           : false,
    isInternetReachable         : true,
    isConnectingAfterBackground : false,
    isTryingToConnectVisible    : false,
    isNoConnectScreenVisible    : false,
    isAppAtateSynced            : true
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case NETWORK_STATUS_UPDATE: {
            draft.isInternetReachable = payload.isInternetReachable;
            if (!payload.isInternetReachable)  draft.isAppAtateSynced = false;
            break;
        }

        case APP_SWITCH_TO_BACKGROUND: {
            draft.isAppInBackground = true;
            draft.isAppAtateSynced = false;
            break;
        }

        case UPDATE_HOMIE_STATE:
        case CONNECT_SUCCESS: {
            draft.isAppAtateSynced = true;
            break;
        }

        case CONNECTING_AFTER_BACKGROUND_UPDATE: {
            draft.isAppInBackground = false;
            draft.isConnectingAfterBackground = payload.isConnectingAfterBackground;
            draft.isAppAtateSynced = !payload.isConnectingAfterBackground;
            break;
        }

        case TRYING_TO_CONNECT_UPDATE: {
            draft.isTryingToConnectVisible = payload.isTryingToConnectVisible;
            break;
        }
        case NO_CONNECT_SCREEN_UPDATE: {
            draft.isNoConnectScreenVisible = payload.isNoConnectScreenVisible;
            break;
        }

        case DISCONNECT: {
            return {
                ...initialState,
                isNoConnectScreenVisible : !draft.isInternetReachable
            };
        }

        default:
            break;
    }
}, initialState);
