/* eslint-disable more/no-duplicated-chains */
/* eslint-disable max-len */
import {  Alert }                                   from 'react-native';
import config                                       from '../../config';

import smartHome                                    from '../../smartHome';
import store                                        from '../../store';

import {
    getHomieErrorTitle,
    HOMIE_ERROR_MESSAGE
}    from '../../homie/errors';
import EventCache                                   from '../../homie/EventCache';
import { PROCESSING_FIELDS }                        from '../../homie/constants';

import i18n                                         from '../../utils/i18n/index';

export const ADD_ATTRIBUTE_ERROR               = 'ADD_ATTRIBUTE_ERROR';
export const UPDATE_ATTRIBUTE_BY_TOPIC         = 'UPDATE_ATTRIBUTE_BY_TOPIC';
export const UPDATE_HOMIE_STATE                = 'UPDATE_HOMIE_STATE';
export const CHANGE_ATRIBUTE_PROCESSING_STATUS = 'CHANGE_ATRIBUTE_PROCESSING_STATUS';
export const HANDLE_DEVICE_DELETE              = 'HANDLE_DEVICE_DELETE';
export const GET_DEVICES                       = 'GET_DEVICES';
const ERROR_MESSAGES_WITH_NO_TOASTS = [
    'Error with sending test message'
];

export const eventCache = new EventCache({
    debounceTime : 100,
    cacheSize    : +config.MQTT_CACHE_LIMIT,
    handler      : updateSchema => store.dispatch(updateHomieState(updateSchema))
});


export function handlePublishEvent({ field, value, type = '', device = null, node = null, property = null }) {
    let deviceId;

    let nodeId = null;

    let propertyId = null;

    switch (type) {     // eslint-disable-line default-case
        case 'DEVICE':
            deviceId = device.getId();
            break;
        case 'NODE':
            deviceId = device.getId();
            nodeId = node.getId();
            break;
        case 'DEVICE_TELEMETRY':
        case 'DEVICE_OPTION':
        case 'NODE_SETTING':
            deviceId = device.getId();
            propertyId = property.getId();
            break;
        case 'SENSOR':
        case 'NODE_TELEMETRY':
        case 'NODE_OPTION':
            deviceId = device.getId();
            nodeId = node.getId();
            propertyId = property.getId();
            break;
    }

    eventCache.push({
        type : 'UPDATE_EVENT',
        data : { field, value, type, deviceId, nodeId, propertyId }
    });
    const processingField =  PROCESSING_FIELDS[field];

    eventCache.push({
        type : 'UPDATE_EVENT',
        data : { field: processingField, value: false, type, deviceId, nodeId, propertyId }
    });
}


export function handlePublishError({
    code,
    message
}) {
    return () => {
        if (ERROR_MESSAGES_WITH_NO_TOASTS.includes(message)) return;

        const title = getHomieErrorTitle(code) || i18n.t('Unknown error');
        const descriprion = HOMIE_ERROR_MESSAGE[code]() || i18n.t('Something went wrong. Please, try again later');

        Alert.alert(title, descriprion);
    };
}

export function handleAttributeError({
    hardwareType,
    propertyType,
    code,
    message,
    fields,
    field,
    deviceId = null,
    nodeId = null,
    propertyId = null
}) {
    return (dispatch) => {
        dispatch({
            type  : ADD_ATTRIBUTE_ERROR,
            error : {
                value : message,
                hardwareType,
                propertyType,
                propertyId,
                deviceId,
                nodeId,
                field
            }
        });

        dispatch(handlePublishError({ code, message, fields, deviceId, nodeId, propertyId }));
    };
}
export function handleHardwareDelete({ type, deviceId /* , nodeId, entityId, scenarioId, thresholdId */ }) {
    return dispatch => {
        switch (type) {
            case 'DEVICE':
                dispatch(handleDeviceDelete(deviceId));
                break;
            // case 'NOTIFICATION':
            //     dispatch(handleNotificationDelete());
            //     break;
            default:
                break;
        }
    };
}


export function getIDsByTopic(topic) {
    return () => {
        const ids = {
            deviceId     : undefined,
            nodeId       : undefined,
            propertyId   : undefined,
            propertyType : undefined
        };

        try {
            const { instance, type } = smartHome.getInstanceByTopic(topic);

            switch (type) {     // eslint-disable-line default-case
                case 'DEVICE':
                    ids.deviceId = instance.id;
                    break;
                case 'NODE':
                    ids.deviceId = instance.device.id;
                    ids.nodeId   = instance.id;
                    break;
                case 'DEVICE_TELEMETRY':
                case 'DEVICE_OPTION':
                    ids.deviceId   = instance.device.id;
                    ids.propertyId = instance.id;
                    break;
                case 'SENSOR':
                case 'NODE_TELEMETRY':
                case 'NODE_OPTION':
                    ids.deviceId   = instance.device.id;
                    ids.nodeId     = instance.node.id;
                    ids.propertyId = instance.id;
                    break;
            }

            ids.propertyType = type;
        } catch (error) {
            console.log(`Get instance by topic ("${topic}") error: `, error);
        }

        return ids;
    };
}

export function setAttribute({ topic, value, onSuccess, onError }) {
    return async dispatch => {
        const IDs = dispatch(getIDsByTopic(topic));

        try {
            const { instance } = smartHome.getInstanceByTopic(topic);
            const instanceValue = instance.value;

            if (value !== instanceValue) {
                dispatch(updateAttributeByTopic({ isValueProcessing: true, ...IDs, editValue: value }));
                await instance.setAttribute('value', value);

                dispatch(updateAttributeByTopic({ value, isValueProcessing: false, ...IDs, editValue: '' }));
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.log('Set attribute error: ', error);
            if (onError) onError();
            dispatch(handlePublishError(error));
            dispatch(updateAttributeByTopic({ isValueProcessing: false, ...IDs, editValue: ''  }));
        }
    };
}

export function updateAttributeByTopic(payload) {
    return {
        type : UPDATE_ATTRIBUTE_BY_TOPIC,
        payload
    };
}

function updateHomieState(updateSchema) {
    return dispatch => {
        dispatch({
            type    : UPDATE_HOMIE_STATE,
            payload : { updateSchema }
        });
    };
}


export function getDevices() {
    return async dispatch => {
        try {
            const devices = await smartHome.getDevices();
            const serializedDevices = {};

            for (const type in devices) {
                if (devices.hasOwnProperty(type)) {
                    const device = devices[type];

                    device.onAttributePublish(handlePublishEvent);

                    const serialized = device.serialize();

                    serializedDevices[serialized.id] = serialized;
                }
            }

            await dispatch({
                type    : GET_DEVICES,
                payload : { devices: serializedDevices }
            });
        } catch (error) {
            console.log('Get devices by types error', error);
        }
    };
}

export function handleDeviceDelete(deviceId) {
    return dispatch => {
        dispatch({
            type    : HANDLE_DEVICE_DELETE,
            payload : { deviceId }
        });
    };
}
