import produce from 'immer';

import {
    CONNECT_LOST,
    CONNECT_RESTORE,
    DISCONNECT,
    CONNECT_REQUEST,
    CONNECT_SUCCESS,
    CONNECT_ERROR
} from '../../actions/homie/connection';

const initialState = {
    isConnected : null,
    isLoading   : true
};

export default produce((draft, action) => {
    const { type } = action;

    switch (type) {
        case CONNECT_REQUEST: {
            draft.isLoading = true;
            break;
        }
        case CONNECT_SUCCESS: {
            draft.isConnected = true;
            draft.isLoading = false;
            break;
        }
        case CONNECT_ERROR: {
            draft.isConnected = false;
            draft.isLoading = false;
            break;
        }

        case CONNECT_LOST: {
            draft.isConnected = false;
            draft.isLoading = false;
            break;
        }

        case CONNECT_RESTORE: {
            draft.isConnected = true;
            break;
        }

        case DISCONNECT: {
            return {
                ...initialState
            };
        }
        default:
            break;
    }
}, initialState);
