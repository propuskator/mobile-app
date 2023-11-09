
import api                                  from '../apiSingleton';
import { isInternetConnectedSelector }      from '../selectors/connection';
import smartHome                            from '../smartHome';

import SiriQueue                            from '../utils/SiriQueue';
import { mapAccessPoint }                   from '../utils/mapper/mapAccessPoints';
// import { ACCESS_POINTS_ERRORS }             from '../utils/validation/errors';
import toast                                from '../utils/Toast';
import i18n                                 from '../utils/i18n';
import store                                from '../store';
import sessionManager                       from '../SessionManager';
import { forbiddenLogout } from './session';
import { setAttribute }                     from './homie/homie';


export const START_ACESS_POINTS_PROCESSING  = 'START_ACESS_POINTS_PROCESSING';
export const GET_ACESS_POINTS_SUCCESS       = 'GET_ACESS_POINTS_SUCCESS';
export const STOP_ACESS_POINTS_PROCESSING   = 'STOP_ACESS_POINTS_PROCESSING';
export const CHANGE_ACESS_POINTS_PROCESSING = 'CHANGE_ACESS_POINTS_PROCESSING';

export const CHANGE_ACESS_POINT_PROCESSING = 'CHANGE_ACESS_POINT_PROCESSING';

export const OPEN_ACESS_POINT_SUCCESS = 'OPEN_ACESS_POINT_SUCCESS';
export const OPEN_ACESS_POINT_ERROR   = 'OPEN_ACESS_POINT_ERROR';

export const UPDATE_LOCAL_ACCESS_POINTS = 'UPDATE_LOCAL_ACCESS_POINTS';


export const siriQueue = new SiriQueue({
    handler : (params) => store.dispatch(triggerAccessPoint(params))
});

let processingTimeout;

export function stopProcessing() {
    return async dispatch => {
        if (processingTimeout) clearTimeout(processingTimeout);
        dispatch({
            type : STOP_ACESS_POINTS_PROCESSING
        });
    };
}

export function refreshReaders() {
    return async () => {
        try {
            smartHome.publish('app-sys/$cmd', 'readersRefresh');
        } catch (error) {
            console.log('Refresh readers error', { error });
        }
    };
}

export function getAccessPoints() {
    return async (dispatch, getState) => {
        const state = getState();
        const isInternetConnected = isInternetConnectedSelector(state);
        const currentAcessPoints = state.accessPoints?.list || [];

        if (isInternetConnected) {
            if (processingTimeout) clearTimeout(processingTimeout);
            processingTimeout = setTimeout(() => {
                dispatch({
                    type : START_ACESS_POINTS_PROCESSING
                });
            }, 500);

            try {
                const res = await api.accessPoints.list();
                const accessPoints = res.data.map(mapAccessPoint);

                let isChanged = false;

                accessPoints?.forEach(item => {
                    if (currentAcessPoints?.find(el => el.id === item?.id)) return;

                    isChanged = true;
                });

                if (isChanged) dispatch(refreshReaders());

                dispatch({
                    type    : GET_ACESS_POINTS_SUCCESS,
                    payload : {
                        list : accessPoints
                    }
                });
            } catch (error) {
                console.log({ error });
                if (error.type === 'forbidden') {
                    dispatch(forbiddenLogout());
                }
                console.log('Get access points', error);
            } finally {
                dispatch(stopProcessing());
            }
        }
    };
}

export function triggerAccessPointWithQueue({ topic, value, accessPointName }) {
    return async (dispatch, getState) => {
        const state = getState();
        const localJwt =  sessionManager.getActiveUser().jwt;

        const { isConnected } = state.homieConnection;
        const { isAppAtateSynced } = state.connection;
        const isLogedIn = !!localJwt;
        const actionParams = {
            topic,
            value,
            withToast : true,
            accessPointName
        };


        if (isLogedIn && isConnected && isAppAtateSynced) {
            dispatch(triggerAccessPoint(actionParams));
        } else {
            siriQueue.push(actionParams);
        }
    };
}

export function triggerAccessPoint({ topic, value, accessPointName, withToast = false } = {}) {
    return async dispatch => {
        const { instance } = smartHome?.getInstanceByTopic(topic) || {};
        const isValueChanged =  instance?.value !== value;


        if (!isValueChanged) return;

        await dispatch(setAttribute({
            topic,
            value,
            onSuccess : () => {
                if (!withToast || !accessPointName) return;
                const isRelay = topic?.includes('/r/');
                const isOpened = [ true, 'true' ]?.includes(value);

                let message = '';

                if (isRelay) {
                    message = isOpened
                        ? 'Relay has been opened'
                        : 'Relay has been closed';
                } else {
                    message = isOpened
                        ? 'Access point has been opened'
                        : 'Access point has been closed';
                }

                toast.show(i18n.t(message, { name: accessPointName }), 2);
            }
        }));
    };
}

export function updateLocalAccessPoints(points) {
    return {
        type    : UPDATE_LOCAL_ACCESS_POINTS,
        payload : {
            points
        }
    };
}

export function updateRemoteAccessPoints(points) {
    return async () => {
        try {
            await api.accessPoints.save(points);
        } catch (error) {
            console.log('Update remote points error', error);
        }
    };
}


export function renameAccessPoint({
    accessTokenReaderId, customName,
    onSuccess, onError, onFinally
}) {
    return async () => {
        try {
            const payload = { accessTokenReaderId, customName };

            const { data } = await api.accessPoints.rename(payload);
            // await dispatch(getAccessPoints());

            if (onSuccess) onSuccess(data);
        } catch (error) {
            console.log('Rename point error', error);

            if (onError) {
                onError({ error, target: 'alert' });
            }
        } finally {
            if (onFinally) onFinally();
        }
    };
}

export function updateGroupAccessPointsOrder(points, groupId) {
    return async () => {
        try {
            await api.accessPoints.updateOrderInGroup(groupId, points);
        } catch (error) {
            console.log('Update remote points error', error);
        }
    };
}
