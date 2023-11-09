import produce                  from 'immer';

import { SET_LINK, SET_PARAMS } from '../actions/linking';

const initialState = {
    deepLinkUrl    : '',
    deepLinkParams : {}
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_LINK: {
            draft.deepLinkUrl = payload.deepLinkUrl;
            break;
        }

        case SET_PARAMS: {
            draft.deepLinkParams = payload.deepLinkParams;
            break;
        }
        default:
            break;
    }
}, initialState);
