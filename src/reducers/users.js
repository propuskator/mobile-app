import produce                      from 'immer';
import {
    UPDATE_BIOMETRIC_ENABLE,
    UPDATE_RESTORE_PASS_WORKSPACE,
    UPDATE_RESTORE_PASS_EMAIL,
    UPDATE_RESTORE_PASS_TOKEN,
    UPDATE_RESTORE_PASS_CODE,
    UPDATE_HIDE_GROUPS,
    SWITCH_ACCOUNT_START,
    SWITCH_ACCOUNT_END
}                                   from '../actions/users';

const initialState = {
    isBiometricEnable : false,
    isSwitching       : false,
    restorePassword   : {
        workspace : '',
        email     : '',
        token     : '',
        code      : ''
    },
    hideGroups : false
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_HIDE_GROUPS: {
            draft.hideGroups    = payload.hideGroups;
            break;
        }
        case UPDATE_BIOMETRIC_ENABLE: {
            draft.isBiometricEnable   = payload.isBiometricEnable;
            break;
        }
        case UPDATE_RESTORE_PASS_WORKSPACE: {
            draft.restorePassword.workspace = payload.workspace;
            break;
        }
        case UPDATE_RESTORE_PASS_EMAIL: {
            draft.restorePassword.email = payload.email;
            break;
        }
        case UPDATE_RESTORE_PASS_TOKEN: {
            draft.restorePassword.token = payload.token;
            break;
        }
        case UPDATE_RESTORE_PASS_CODE: {
            draft.restorePassword.code = payload.code;
            break;
        }
        case SWITCH_ACCOUNT_START: {
            draft.isSwitching = true;
            break;
        }
        case SWITCH_ACCOUNT_END: {
            draft.isSwitching = false;
            break;
        }
        // case LOGOUT: {
        //     draft.currentUser.id    = '';
        //     draft.currentUser.email = '';
        //     break;
        // }
        default:
            break;
    }
}, initialState);
