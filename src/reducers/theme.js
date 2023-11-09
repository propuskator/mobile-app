import produce from 'immer';

import {
    UPDATE_THEME_VALUE,
    INITIALIZED_THEME_MODE
} from '../actions/theme';

const initialState = {
    mode          : 'light',
    isInitialized : false
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_THEME_VALUE: {
            draft.mode = payload.mode;

            break;
        }

        case INITIALIZED_THEME_MODE: {
            draft.isInitialized = true;

            break;
        }

        default:
            break;
    }
}, initialState);
