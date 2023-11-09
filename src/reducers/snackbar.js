import produce from 'immer';
import {
    SHOW_MESSAGE,
    DISMISS_MESSAGE
} from '../actions/snackbar';

const initialState = {
    type    : '',
    message : ''
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case SHOW_MESSAGE: {
            draft.type = payload.type;
            draft.message = payload.message;
            break;
        }
        case DISMISS_MESSAGE: {
            draft.type    = '';
            draft.message = '';
            break;
        }
        default:
            break;
    }
}, initialState);
