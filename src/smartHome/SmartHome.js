import MQTTTransport from 'homie-sdk/lib/Broker/native-mqtt';
import Homie         from 'homie-sdk/lib/homie/Homie';
import HomieClient   from 'homie-sdk/lib/homie/HomieClient';

class SmartHome {
    constructor({
        handleBrokerConnectionLost,
        handleBrokerConnectionRestored,
        handleAddNewDevice,
        handleAddNewNode,
        handleAddNewSensor,
        handleAddNewDeviceTelemetry,
        handleAddNewDeviceOption,
        handleAddNewNodeTelemetry,
        handleAddNewNodeOption,
        handleHardwareDelete,
        handleAddNewBridgeEntity,
        handleAddNewGroupEntity,
        handleAddNewNotification,
        handleDiscoveryAccepte,
        handleDiscoveryDelete,
        handleAddNewDiscovery,
        handleAddNewBridgeTypeEntity,
        handleAddNewNotificationChannel,
        handleSystemUpdates,
        handleAddNewAlias
    }) {
        this.handleBrokerConnectionLost = handleBrokerConnectionLost;
        this.handleBrokerConnectionRestored = handleBrokerConnectionRestored;
        this.handleAddNewDevice = handleAddNewDevice;
        this.handleAddNewNode = handleAddNewNode;
        this.handleAddNewSensor = handleAddNewSensor;
        this.handleAddNewDeviceTelemetry = handleAddNewDeviceTelemetry;
        this.handleAddNewDeviceOption = handleAddNewDeviceOption;
        this.handleAddNewNodeTelemetry = handleAddNewNodeTelemetry;
        this.handleAddNewNodeOption = handleAddNewNodeOption;
        this.handleHardwareDelete = handleHardwareDelete;
        this.handleAddNewBridgeEntity = handleAddNewBridgeEntity;
        this.handleAddNewBridgeTypeEntity = handleAddNewBridgeTypeEntity;
        this.handleAddNewGroupEntity = handleAddNewGroupEntity;
        this.handleDiscoveryAccepte = handleDiscoveryAccepte;
        this.handleDiscoveryDelete = handleDiscoveryDelete;
        this.handleAddNewDiscovery = handleAddNewDiscovery;
        this.handleAddNewNotificationChannel = handleAddNewNotificationChannel;
        this.handleAddNewNotification = handleAddNewNotification;
        this.handleSystemUpdates = handleSystemUpdates;
        this.handleAddNewAlias = handleAddNewAlias;
        this.isRunning = false;
        this.defferedFunctions = [];
    }

    _getSessionId() {
        return `propuskaror_mobile_${Math.random().toString(16).substr(2, 8)}`;
    }

    async connect({ brokerUrl, username, password, syncMaxDelay, syncResetTimeout, rootTopic = '' }, onError) {
        const transport = new MQTTTransport({
            session : this._getSessionId(),
            uri     : brokerUrl,
            username,
            password,
            rootTopic
        });

        this.homie = new Homie({ transport, syncMaxDelay, syncResetTimeout });
        this.homie.on('offline', this.handleBrokerConnectionLost);
        this.homie.transport.on('reconnect', () => {
            this.homie.transport.client.options.clientId = this._getSessionId();
        });
        this.homie.on('online', this.handleBrokerConnectionRestored);
        this.homie.on('error', error => {
            if (error.message === 'Connection refused: Not authorized') {
                this.homie.transport.end();
                if (onError) onError(error);
            }
        });

        const homieClient = new HomieClient({ homie: this.homie });

        this.homieClient = homieClient;

        await this.init();
    }

    async init() {
        try {
            await this.homieClient.initWorld();
            this.isRunning = true;
            this.defferedFunctions.forEach(({ resolve, getResult }) => resolve(getResult()));
            this.onNewDeviceAdded();
            this.onNewNodeAdded();
            this.onNewSensorAdded();
            this.onNewDeviceTelemetryAdded();
            this.onNewDeviceOptionAdded();
            this.onNewNodeTelemetryAdded();
            this.onNewNodeOptionAdded();
            this.onDelete();
            this.onDiscoveryAccepted();
            this.onDiscoveryDelete();
            this.onNewDiscoveryAdded();
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    initializeEntityClass(type) {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.initializeEntityClass(type);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    publish(topic, value) {
        return this.homieClient.homie.publishToBroker(`${topic}/set`, value);
    }

    destroyEntityClass(type) {
        return this.homieClient.destroyEntityClass(type);
    }

    getDevices() {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getDevices();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getDevicesByTypes(types) {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getDevicesByTypes(types);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getThresholds() {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getThresholds();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getEntities(type) {
        return new Promise(resolve => {
            const getResult = () => this.homieClient.getEntities(type);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getDiscovery() {
        return new Promise(resolve => {
            const getResult = () => this.homieClient.getDiscovery();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getDeviceById(id) {
        return this.homieClient.getDeviceById(id);
    }

    getThresholdById(scenarioId, id) {
        return this.homieClient.getThresholdById(scenarioId, id);
    }

    getEntityById(type, id) {
        return this.homieClient.getEntityById(type, id);
    }

    getInstanceByTopic(topic) {
        return this?.homieClient?.getInstanceByTopic(topic);
    }

    createEntityRequest(type, payload) {
        return this.homieClient.createEntityRequest(type, payload);
    }

    deleteEntityRequest(type, id) {
        const entity = this.getEntityById(type, id);

        return entity.deleteRequest();
    }

    acceptDiscovery(deviceId) {
        this.homieClient.acceptDiscovery(deviceId);
    }

    deleteDiscovery(deviceId) {
        this.homieClient.deleteDiscovery(deviceId);
    }

    onDiscoveryAccepted() {
        this.homieClient.onDiscoveryAccepted((discovery) => {
            this.handleDiscoveryAccepte(discovery);
        });
    }

    onDiscoveryDelete() {
        this.homieClient.onDiscoveryDelete((discovery) => {
            this.handleDiscoveryDelete(discovery);
        });
    }

    onNewDiscoveryAdded() {
        this.homieClient.onNewDiscoveryAdded((discovery) => {
            this.handleAddNewDiscovery(discovery);
        });
    }

    onNewDeviceAdded() {
        this.homieClient.onNewDeviceAdded(({ deviceId }) => {
            const newDevice = this.homieClient.getDeviceById(deviceId);

            this.handleAddNewDevice(newDevice);
        });
    }

    onNewNodeAdded() {
        this.homieClient.onNewNodeAdded(({ deviceId, nodeId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newNode = device.getNodeById(nodeId);

            this.handleAddNewNode(newNode);
        });
    }

    onNewSensorAdded() {
        this.homieClient.onNewSensorAdded(({ deviceId, nodeId, sensorId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newSensor = node.getSensorById(sensorId);

            this.handleAddNewSensor(newSensor);
        });
    }

    onNewDeviceTelemetryAdded() {
        this.homieClient.onNewDeviceTelemetryAdded(({ deviceId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newTelemetry = device.getTelemetryById(telemetryId);

            this.handleAddNewDeviceTelemetry(newTelemetry);
        });
    }

    onNewDeviceOptionAdded() {
        this.homieClient.onNewDeviceOptionAdded(({ deviceId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newOption = device.getOptionById(optionId);

            this.handleAddNewDeviceOption(newOption);
        });
    }

    onNewNodeTelemetryAdded() {
        this.homieClient.onNewNodeTelemetryAdded(({ deviceId, nodeId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newTelemetry = node.getTelemetryById(telemetryId);

            this.handleAddNewNodeTelemetry(newTelemetry);
        });
    }

    onNewNodeOptionAdded() {
        this.homieClient.onNewNodeOptionAdded(({ deviceId, nodeId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newOption = node.getOptionById(optionId);

            this.handleAddNewNodeOption(newOption);
        });
    }

    onDelete() {
        this.homieClient.onDelete((data) => {
            this.handleHardwareDelete(data);
        });
    }


    disconnect() {
        this.isRunning = false;
        this.homie?.transport.end(true);
        this.homie = null;
        this.homieClient = null;
    }
}

export default SmartHome;
