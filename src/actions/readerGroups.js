
import api                                  from '../apiSingleton';

import { isInternetConnectedSelector }      from '../selectors/connection';
import { mapReaderGroupsList }              from '../utils/mapper/mapReaderGroups';
import {
    withNoConnectErrorRequest
}                                           from '../utils/connectionHelper';
import { getDefaultColor }                  from '../components/screens/utils/groupLogo';

export const GET_READER_GROUPS_SUCCESS      = 'GET_READER_GROUPS_SUCCESS';
export const GET_READER_GROUPS_ERROR        = 'GET_READER_GROUPS_ERROR';
export const START_READER_GROUPS_PROCESSING = 'START_READER_GROUPS_PROCESSING';
export const STOP_READER_GROUPS_PROCESSING  = 'STOP_READER_GROUPS_PROCESSING';
export const CREATE_READER_GROUP_SUCCESS    = 'CREATE_READER_GROUP_SUCCESS';
export const UPDATE_READER_GROUP_SUCCESS    = 'UPDATE_READER_GROUP_SUCCESS';


export function createReaderGroup({ data, onSuccess, onError }) {
    return async (dispatch) => {
        try {
            const response = await api.readerGroups.create({
                ...(data || {}),
                logoColor : data?.logoColor ? data?.logoColor : getDefaultColor()
            });
            const created = response?.data;

            if (onSuccess) onSuccess(created);
            dispatch({
                type    : CREATE_READER_GROUP_SUCCESS,
                payload : {
                    entity : created
                }
            });
        } catch (error) {
            console.log('Create group error', error);
            withNoConnectErrorRequest(error);
            if (onError) onError(error);
        }
    };
}

export function updateReaderGroup({ data, id, onSuccess, onError }) {
    return async (dispatch) => {
        try {
            const response = await api.readerGroups.update(id, data);
            const updated = response?.data;

            if (onSuccess) onSuccess(updated);
            dispatch({
                type    : UPDATE_READER_GROUP_SUCCESS,
                payload : {
                    entity : updated
                }
            });
        } catch (error) {
            console.log('Update group error', error);
            withNoConnectErrorRequest(error);

            if (onError) onError(error);
        }
    };
}


function stopProcessing(timeout) {
    return async dispatch => {
        clearTimeout(timeout);
        dispatch({
            type : STOP_READER_GROUPS_PROCESSING
        });
    };
}

export function getReaderGroups({ onSuccess, onError } = {}) {
    return async (dispatch, getState) => {
        const state = getState();
        const isInternetConnected = isInternetConnectedSelector(state);

        if (isInternetConnected) {
            const timeout = setTimeout(() => {
                dispatch({
                    type : START_READER_GROUPS_PROCESSING
                });
            }, 1000);

            try {
                const res = await api.readerGroups.list();
                const readerGroups = res.data.map(mapReaderGroupsList);

                dispatch({
                    type    : GET_READER_GROUPS_SUCCESS,
                    payload : {
                        list : readerGroups
                    }
                });

                if (onSuccess) onSuccess(readerGroups);
            } catch (error) {
                console.log('Get reader groups error', error);
                if (onError) onError(error);
            } finally {
                dispatch(stopProcessing(timeout));
            }
        }
    };
}

export const GET_READER_GROUPS_LOGOS_START   = 'GET_READER_GROUPS_LOGOS_START';
export const GET_READER_GROUPS_LOGOS_SUCCESS = 'GET_READER_GROUPS_LOGOS_SUCCESS';
export const GET_READER_GROUPS_LOGOS_ERROR   = 'GET_READER_GROUPS_LOGOS_ERROR';

export function getReaderGroupsLogos({ onSuccess, onError } = {}) {
    return async (dispatch, getState) => {
        const state = getState();
        const isInternetConnected = isInternetConnectedSelector(state);
        const logos = Object.keys(state?.readerGroups?.logosById || {});

        if (logos?.length) return;

        dispatch({
            type : GET_READER_GROUPS_LOGOS_START
        });

        if (isInternetConnected) {
            try {
                const response = await api.readerGroups.getLogos();

                dispatch({
                    type    : GET_READER_GROUPS_LOGOS_SUCCESS,
                    payload : {
                        logos : response?.data
                    }
                });

                if (onSuccess) onSuccess(response?.data);
            } catch (error) {
                console.log('Get reader groups logos error', error);
                if (onError) onError(error);
                dispatch({
                    type    : GET_READER_GROUPS_LOGOS_ERROR,
                    payload : {
                        list : logos
                    }
                });
            }
        }
    };
}

export function fetchReaderGroupInfo({ id, onSuccess, onError }) {
    return async () => {
        try {
            const response = await api.readerGroups.show(id);

            if (onSuccess) onSuccess(response?.data);
        } catch (error) {
            if (onError) onError(error);
        }
    };
}


export const DELETE_GROUP_START   = 'DELETE_GROUP_START';
export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS';
export const DELETE_GROUP_END     = 'DELETE_GROUP_END';

export function deleteGroup({ id, onSuccess, onError }) {
    return async (dispatch) => {
        dispatch({
            type    : DELETE_GROUP_START,
            payload : {
                groupId : id
            }
        });

        try {
            await api.readerGroups.delete(id);

            if (onSuccess) onSuccess();

            dispatch({
                type    : DELETE_GROUP_SUCCESS,
                payload : {
                    groupId : id
                }
            });
        } catch (error) {
            withNoConnectErrorRequest(error);
            if (onError) onError(error);
        } finally {
            dispatch({
                type    : DELETE_GROUP_END,
                payload : {
                    groupId : id
                }
            });
        }
    };
}
