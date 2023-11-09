import produce from 'immer';

import { LOGOUT }                     from '../actions/session';
import {
    GET_SUBJECT_TOKENS_SUCCESS,
    GET_SUBJECT_TOKENS_ERROR,
    START_SUBJECT_TOKENS_PROCESSING,
    UPDATE_TOKEN_PROCESSING_VALUE,
    UPDATE_ATTACH_PERMISSION_VALUE,
    UPDATE_ATTACH_PERMISSION
}                                     from '../actions/subjectTokens';

const initialState = {
    list            : [],
    isProcessing    : true,
    canAttachTokens : false
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_SUBJECT_TOKENS_SUCCESS: {
            const { list } = payload;

            draft.list = list;
            draft.isProcessing = false;

            break;
        }
        case GET_SUBJECT_TOKENS_ERROR: {
            draft.isProcessing = false;

            break;
        }
        case START_SUBJECT_TOKENS_PROCESSING: {
            draft.isProcessing = true;

            break;
        }
        case UPDATE_ATTACH_PERMISSION_VALUE: {
            draft.isProcessing = true;

            break;
        }
        case UPDATE_TOKEN_PROCESSING_VALUE: {
            const { id, value } = payload;
            const list = draft.list.map(el => {
                if (el.id === id) {
                    el.isLoading = value;
                }

                return el;
            });

            draft.list = list;

            break;
        }
        case UPDATE_ATTACH_PERMISSION: {
            draft.canAttachTokens = payload.value;

            break;
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            break;
    }
}, initialState);
