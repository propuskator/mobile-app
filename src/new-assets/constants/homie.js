export const HARDWARE_TYPES = [ 'node', 'device', 'threshold' ];
export const PROPERTY_TYPES = [ 'options', 'telemetry', 'sensors', 'threshold' ];
export const PROCESSING_FIELDS = {
    displayed : 'isDisplayProcessing',
    delete    : 'isDeleteProcessing',
    hidden    : 'isHiddenProcessing',
    title     : 'isTitleProcessing',
    value     : 'isValueProcessing'
};

export const ERRORS_FIELDS = {
    displayed : 'displayError',
    delete    : 'deleteError',
    hidden    : 'hiddenError',
    title     : 'titleError',
    value     : 'valueError'
};


export const GET_HARDWARE_TYPE_BY_ATTRIBUTE = {
    DEVICE : {
        hardwareType : 'device'
    },
    NODE : {
        hardwareType : 'node'
    },
    NODE_OPTION : {
        propertyType : 'options',
        hardwareType : 'node'
    },
    NODE_TELEMETRY : {
        hardwareType : 'node',
        propertyType : 'telemetry'
    },
    DEVICE_OPTION : {
        propertyType : 'options',
        hardwareType : 'device'
    },
    DEVICE_TELEMETRY : {
        propertyType : 'telemetry',
        hardwareType : 'device'
    },
    THRESHOLD : {
        propertyType : 'threshold',
        hardwareType : 'threshold'
    },
    SENSOR : {
        propertyType : 'sensors',
        hardwareType : 'node'
    }
};

export const GET_ATTRIBUTE_TYPE_BY_HARDWARE = {
    device : {
        options : {
            title : 'DEVICE_OPTION_SETTINGS',
            value : 'DEVICE_OPTION'
        },
        telemetry : {
            title : 'DEVICE_TELEMETRY_SETTINGS',
            value : 'DEVICE_TELEMETRY'
        },
        settings : {
            displayed : 'DEVICE_SETTING',
            title     : 'DEVICE_SETTING'
        }
    },
    node : {
        options : {
            title : 'NODE_OPTION_SETTINGS',
            value : 'NODE_OPTION'
        },
        sensors : {
            title     : 'NODE_SENSOR_SETTINGS',
            displayed : 'NODE_SENSOR_SETTINGS',
            value     : 'SENSOR'
        },
        telemetry : {
            title : 'NODE_TELEMETRY_SETTINGS',
            value : 'NODE_TELEMETRY'
        },
        settings : {
            hidden : 'NODE_SETTING',
            title  : 'NODE_SETTING'
        }
    },
    threshold : {
        threshold : {
            value : 'THRESHOLD'
        }
    },
    group : {
        group : {
            value : 'GROUP_OF_PROPERTIES'
        }
    }
};
