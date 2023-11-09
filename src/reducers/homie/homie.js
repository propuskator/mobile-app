import produce from 'immer';

import {
    UPDATE_HOMIE_STATE,
    GET_DEVICES,
    UPDATE_ATTRIBUTE_BY_TOPIC,
    CHANGE_ATRIBUTE_PROCESSING_STATUS,
    ADD_ATTRIBUTE_ERROR
} from '../../actions/homie/homie';

import { LOGOUT } from '../../actions/session';

import {
    PROCESSING_FIELDS,
    ERRORS_FIELDS
} from '../../homie/constants';

import {
    patchNodesArray,
    patchSubjectArray
} from '../../homie/utils';

const initialState = {
    devices : {}
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_DEVICES: {
            draft.devices = payload.devices;
            draft.isStateSynced = true;
            break;
        }

        case UPDATE_ATTRIBUTE_BY_TOPIC: {
            const { deviceId, nodeId, propertyId, value, editValue, isValueProcessing, propertyType } = payload;

            let entityToUpdate = null;

            switch (propertyType) {
                case 'DEVICE':
                    entityToUpdate = draft.devices[deviceId];
                    break;
                case 'NODE':
                    entityToUpdate = draft.devices[deviceId].nodes.find(n => n.id === nodeId);
                    break;
                case 'DEVICE_TELEMETRY':
                    entityToUpdate = draft.devices[deviceId].telemetry.find(p => p.id === propertyId);
                    break;
                case 'DEVICE_OPTION':
                    entityToUpdate = draft.devices[deviceId].options.find(p => p.id === propertyId);
                    break;
                case 'SENSOR':
                    entityToUpdate = draft.devices[deviceId]
                        .nodes.find(n => n.id === nodeId)
                        .sensors.find(p => p.id === propertyId);
                    break;
                case 'NODE_TELEMETRY':
                    entityToUpdate = draft.devices[deviceId]
                        .nodes.find(n => n.id === nodeId)
                        .telemetry.find(p => p.id === propertyId);
                    break;
                case 'NODE_OPTION':
                    entityToUpdate = draft.devices[deviceId]
                        .nodes.find(n => n.id === nodeId)
                        .options.find(p => p.id === propertyId);
                    break;
                default:
                    break;
            }

            if (entityToUpdate) {
                if (value !== undefined) entityToUpdate.value = value;
                if (editValue !== undefined) entityToUpdate.editValue = editValue;
                if (isValueProcessing !== undefined) entityToUpdate.isValueProcessing = isValueProcessing;
            }

            break;
        }
        case UPDATE_HOMIE_STATE: {
            const { updateSchema } = action.payload;

            for (const deviceId of Object.keys(updateSchema.devices)) {
                if (updateSchema.devices.hasOwnProperty(deviceId)) {
                    const draftDevice = draft.devices[deviceId];
                    const patchDevice = updateSchema.devices[deviceId];

                    if (draftDevice) {
                        const {
                            nodes     : patchNodes,
                            options   : patchOptions,
                            telemetry : patchTelemetries,
                            ...patchDeviceAttributes
                        } = patchDevice;

                        Object.assign(draftDevice, patchDeviceAttributes);

                        patchSubjectArray(draftDevice, patchOptions, 'options');
                        patchSubjectArray(draftDevice, patchTelemetries, 'telemetry');

                        patchNodesArray(draftDevice, patchNodes);
                    } else {
                        draft.devices[deviceId] = patchDevice;
                    }
                }
            }

            pruneDevices(draft.devices);

            break;
        }
        case CHANGE_ATRIBUTE_PROCESSING_STATUS: {
            const {
                propertyType,
                hardwareType,
                nodeId,
                deviceId,
                propertyId,
                field,
                prcessingStatus
            } = action;
            const device =  draft.devices[deviceId];

            const hardwareToProcess = hardwareType === 'node'
                ? device.nodes.find(({ id }) => id === nodeId)
                : device;

            const propertyToProcess = propertyType === 'settings'
                ? hardwareToProcess
                : hardwareToProcess[propertyType].find(({ id }) => id === propertyId);

            const processingField = PROCESSING_FIELDS[field];

            propertyToProcess[processingField] = prcessingStatus;

            draft.isStateSynced = true;
            break;
        }
        case ADD_ATTRIBUTE_ERROR: {
            const { deviceId, nodeId, propertyId, hardwareType, propertyType, field, value } = action.error;
            const device =  draft.devices[deviceId];

            const hardwareToProcess = hardwareType === 'node'
                ? device.nodes.find(({ id }) => id === nodeId)
                : device;

            const property =  propertyType === 'settings'
                ? hardwareToProcess
                : hardwareToProcess[propertyType].find(({ id }) => id === propertyId);

            const processingField = PROCESSING_FIELDS[field];
            const errorField = ERRORS_FIELDS[field];

            property[processingField] = false;
            property[errorField] = {
                value,
                isExist : true
            };
            break;
        }
        case LOGOUT:
            draft.devices = initialState.devices;
            break;
        default:
            break;
    }
}, initialState);

// Remove devices without id property
function pruneDevices(draftDevices) {
    for (const key of Object.keys(draftDevices)) {
        if (draftDevices?.hasOwnProperty(key)) {
            const device = draftDevices[key];

            if (!device?.id) {
                delete draftDevices[key];
            }
        }
    }
}
