import api                 from '../apiSingleton';
import { withNoConnectErrorRequest }  from '../utils/connectionHelper';
import { forbiddenLogout } from './session';

export const GET_SUBJECT_TOKENS_SUCCESS      = 'GET_SUBJECT_TOKENS_SUCCESS';
export const START_SUBJECT_TOKENS_PROCESSING = 'START_SUBJECT_TOKENS_PROCESSING';
export const UPDATE_TOKEN_PROCESSING_VALUE = 'UPDATE_TOKEN_PROCESSING_VALUE';
export const UPDATE_ATTACH_PERMISSION_VALUE = 'UPDATE_ATTACH_PERMISSION_VALUE';
export const UPDATE_ATTACH_PERMISSION = 'UPDATE_ATTACH_PERMISSION';
export const GET_SUBJECT_TOKENS_ERROR = 'GET_SUBJECT_TOKENS_ERROR';


function updateTokenProcessingValue(id, value) {
    return async dispatch => {
        dispatch({
            type    : UPDATE_TOKEN_PROCESSING_VALUE,
            payload : { id, value }
        });
    };
}

export function getSubjectTokens() {
    return async dispatch => {
        try {
            dispatch({ type: START_SUBJECT_TOKENS_PROCESSING });

            const res = await api.subjectTokens.list();

            const subjectTokens = res.data;

            dispatch({
                type    : GET_SUBJECT_TOKENS_SUCCESS,
                payload : {
                    list : subjectTokens
                }
            });
        } catch (error) {
            console.log('Get subject tokens', error);
            dispatch({ type: GET_SUBJECT_TOKENS_ERROR });

            if (error.type === 'forbidden') {
                await dispatch(forbiddenLogout());
            }
        }
    };
}

export function attachToken({ payload, onSuccess, onError }) {
    return async dispatch => {
        try {
            await api.subjectTokens.attach({ ...payload });
            dispatch(getSubjectTokens());

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log('Attach token error', error);
            withNoConnectErrorRequest(error, onError);
        }
    };
}

export function detachToken(id) {
    return async dispatch => {
        try {
            await dispatch(updateTokenProcessingValue(id, true));
            await api.subjectTokens.detach(id);
            dispatch(getSubjectTokens());
        } catch (error) {
            await dispatch(updateTokenProcessingValue(id, false));

            withNoConnectErrorRequest(error);

            console.log('Detach token error', error);
        }
    };
}

export function updateTokenState(id, value) {
    return async dispatch => {
        try {
            await dispatch(updateTokenProcessingValue(id, true));

            if (value) {
                await api.subjectTokens.enable(id);
            } else {
                await api.subjectTokens.disable(id);
            }

            dispatch(getSubjectTokens());
        } catch (error) {
            withNoConnectErrorRequest(error);
            await dispatch(updateTokenProcessingValue(id, false));

            console.log('Update token state error', error);
        }
    };
}

export function cheskPermission() {
    return async dispatch => {
        try {
            const res = await api.subjectTokens.checkPermission();
            const { canAttachTokens } = res.data;

            dispatch(updateAttachPermission(canAttachTokens));
        } catch (error) {
            console.log('Check subject permission error', error);
        }
    };
}

export function updateAttachPermission(value) {
    return {
        type    : UPDATE_ATTACH_PERMISSION,
        payload : { value }
    };
}
