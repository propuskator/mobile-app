import produce from 'immer';

import {
    CHECK_SESSION_SUCCESS,
    UPDATE_SESSION_ERROR,
    LOGOUT,
    USER_STATE_INITIALIZED,
    CHECK_SESSION,
    CREATE_SESSION_STOP,
    CREATE_SESSION_START
} from '../actions/session';

const initialState = {
    isUserStateInitialized : false,
    isSessionExist         : null,
    isSessionChecking      : false,
    isSessionCreating      : false
};

export default produce((draft, action) => {
    const { type } = action;

    switch (type) {
        case  CHECK_SESSION: {
            draft.isSessionChecking = true;
            break;
        }
        case CHECK_SESSION_SUCCESS: {
            draft.isSessionExist = true;
            draft.isUserStateInitialized = true;
            draft.isSessionChecking = false;
            break;
        }

        case UPDATE_SESSION_ERROR: {
            draft.isSessionExist = false;
            draft.isUserStateInitialized = true;
            draft.isSessionChecking = false;
            break;
        }


        case USER_STATE_INITIALIZED: {
            draft.isUserStateInitialized = true;
            break;
        }

        case  CREATE_SESSION_START: {
            draft.isSessionCreating = true;
            break;
        }
        case CREATE_SESSION_STOP: {
            draft.isSessionCreating = false;
            break;
        }
        case LOGOUT: {
            draft.isSessionExist = null;
            break;
        }
        default:
            break;
    }
}, initialState);
