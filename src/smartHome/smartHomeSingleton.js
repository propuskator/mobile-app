import {
    addNewDevice as handleAddNewDevice,
    addNewNode as handleAddNewNode,
    addNewSensor as handleAddNewSensor,
    addNewDeviceTelemetry as handleAddNewDeviceTelemetry,
    addNewDeviceOption as handleAddNewDeviceOption,
    addNewNodeTelemetry as handleAddNewNodeTelemetry,
    addNewNodeOption as handleAddNewNodeOption
} from '../actions/homie/homieHandlers';

import {
    dispatchBrokerConnectionLost as handleBrokerConnectionLost,
    dispatchBrokerConnectionRestore as handleBrokerConnectionRestored,
    dispatchHandleHardwareDelete as handleHardwareDelete
} from '../actions/homie/decoratedHomieActions';

import SmartHome     from './SmartHome';

const smartHome = new SmartHome({
    handleBrokerConnectionLost,
    handleBrokerConnectionRestored,
    handleAddNewDevice,
    handleAddNewNode,
    handleAddNewSensor,
    handleAddNewDeviceTelemetry,
    handleAddNewDeviceOption,
    handleAddNewNodeTelemetry,
    handleAddNewNodeOption,
    handleHardwareDelete
});

export default smartHome;
