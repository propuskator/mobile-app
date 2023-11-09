import smartHome  from '../smartHome/smartHomeSingleton';
import { GET_ATTRIBUTE_TYPE_BY_HARDWARE } from './constants';


export default class AttributeDispatcher {
    constructor() {
        this.expireTimeouts = {};
        this.processing = false;
    }

    SET_ATTRIBUTE_METHODS = {
        'DEVICE_OPTION'             : this._setDeviceOptionAttribute,
        'DEVICE_TELEMETRY'          : this._setDeviceTelemetryAttribute,
        'DEVICE_SETTING'            : this._setDeviceSettingAttribute,
        'NODE_SETTING'              : this._setNodeSettingAttribute,
        'NODE_OPTION'               : this._setNodeOptionAttribute,
        'NODE_TELEMETRY'            : this._setNodeTelemetryAttribute,
        'SENSOR'                    : this._setNodeSensorAttribute,
        'NODE_OPTION_SETTINGS'      : this._setNodeOptionSettingsAttribute,
        'NODE_TELEMETRY_SETTINGS'   : this._setNodeTelemetrySettingsAttribute,
        'NODE_SENSOR_SETTINGS'      : this._setNodeSensorSettingsAttribute,
        'DEVICE_OPTION_SETTINGS'    : this._setDeviceOptionSettingsAttribute,
        'DEVICE_TELEMETRY_SETTINGS' : this._setDeviceTelemetrySettingsAttribute,
        'NOTIFICATION_CHANNELS'     : this._setEntityAttribute,
        'BRIDGE'                    : this._setEntityAttribute,
        'BRIDGE_TYPES'              : this._setEntityAttribute,
        'TOPICS_ALIASES'            : this._setEntityAttribute,
        'SYSTEM_UPDATES'            : this._setSystemUpdatesAttribute
    };

    UPDATE_ENTITY_METHODS = {
        'NOTIFICATION_CHANNELS' : this._updateEntityRequest
    };

    setAsyncAttribute= async ({
        hardwareType = null,
        propertyType = null,
        deviceId = null,
        nodeId = null,
        propertyId = null,
        entityId = null,
        field = 'value',
        value,
        type
    }) => {
        const attributeType = type || GET_ATTRIBUTE_TYPE_BY_HARDWARE[hardwareType][propertyType][field];
        const method = this.SET_ATTRIBUTE_METHODS[attributeType];

        return method({  deviceId, nodeId, propertyId, entityId, value, field, type });
    }

    updateEntity = async ({
        type, deviceId = null, nodeId = null, propertyId = null, entityId = null, field, value
    }) => {
        const method = this.UPDATE_ENTITY_METHODS[type];

        return method({ type, deviceId, nodeId, propertyId, entityId, value, field });
    }


    _setDeviceOptionAttribute({ deviceId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const option = device.getOptionById(propertyId);

        return option.setAttribute('value', value);
    }

    _setDeviceTelemetryAttribute({ deviceId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const telemetry = device.getTelemetryById(propertyId);

        return telemetry.setAttribute('value', value);
    }

    _setDeviceSettingAttribute({ deviceId, field, value }) {
        const device = smartHome.getDeviceById(deviceId);

        return device.setSettingAttribute(field, value);
    }

    _setNodeSettingAttribute({ deviceId, nodeId, field, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);

        return node.setSettingAttribute(field, value);
    }


    _updateEntityRequest({ type, entityId, value }) {
        const entity = smartHome.getEntityById(type, entityId);

        return entity.updateRequest(value);
    }

    _setNodeOptionAttribute({ deviceId, nodeId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const option = node.getOptionById(propertyId);

        return option.setAttribute('value', value);
    }

    _setNodeTelemetryAttribute({ deviceId, nodeId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const telemetry = node.getTelemetryById(propertyId);

        return telemetry.setAttribute('value', value);
    }

    _setDeviceOptionSettingsAttribute({ deviceId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const option = device.getOptionById(propertyId);

        return option.setSettingAttribute('title', value);
    }

    _setDeviceTelemetrySettingsAttribute({ deviceId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const telemetry = device.getTelemetryById(propertyId);

        return telemetry.setSettingAttribute('title', value);
    }

    _setNodeOptionSettingsAttribute({ deviceId, nodeId, propertyId, value, field }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const option = node.getOptionById(propertyId);

        return option.setSettingAttribute(field, value);
    }

    _setNodeTelemetrySettingsAttribute({ deviceId, nodeId, propertyId, value, field }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const telemetry = node.getTelemetryById(propertyId);

        return telemetry.setSettingAttribute(field, value);
    }

    _setNodeSensorSettingsAttribute({ deviceId, nodeId, propertyId, value, field }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const sensor = node.getSensorById(propertyId);

        return sensor.setSettingAttribute(field, value);
    }

    _setNodeSensorAttribute({ deviceId, nodeId, propertyId, value }) {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);
        const sensor = node.getSensorById(propertyId);

        return sensor.setAttribute('value', value);
    }

    _setEntityAttribute({ type, entityId, field, value }) {
        const entity = smartHome.getEntityById(type, entityId);

        return entity.setAttribute(field, value);
    }

    _setSystemUpdatesAttribute({ type, entityId, field, value }) {
        const entity = smartHome.getEntityById(type, entityId);

        return entity.setAttribute(field, value);
    }
}
