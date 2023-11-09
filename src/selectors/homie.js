export const accessPointsSelector = state => {
    const { devices } = state.homie;
    const  accessPointsList  = state.accessPoints.list;

    return getFulfilledAccessPoints(accessPointsList, devices);
};

export function getFulfilledAccessPoints(list, devices) {
    return list
        ?.map(accessPoint => constructAccessPointData({
            devices,
            restAccessPointData : accessPoint
        }));
}

export const accessPointsByListSelector = (state, accessPoints) => {
    const { devices } = state.homie;
    const  accessPointsList  = accessPoints;

    return accessPointsList
        ?.map(accessPoint => constructAccessPointData({
            devices,
            restAccessPointData : accessPoint
        }));
};


export const getAccessPointById = (state, accessPointId) => {
    const { devices } = state.homie;
    const  accessPointsList  = state.accessPoints.list;
    const restAccessPointData = accessPointsList
        ?.find(accessPoint => accessPoint.id === accessPointId);

    return constructAccessPointData({ devices, restAccessPointData });
};

export const constructAccessPointData = ({ devices, restAccessPointData }) => {
    const accessPointId = restAccessPointData?.code;
    const device = devices[accessPointId];
    const nodeEntity = device?.nodes.find(node => node.id === 'd');
    const sensorEntity = nodeEntity?.sensors?.find(sensor => sensor.id === 's');
    const isEditable = restAccessPointData?.status === 'active';

    return sensorEntity
        ? {
            ...restAccessPointData,
            ...mapAccessPoint({ sensorEntity, nodeEntity }),
            isEditable
        }
        : {
            ...restAccessPointData,
            isEditable
        };
};


export const mapAccessPoint = ({ sensorEntity }) => ({
    value             : sensorEntity.value,
    topic             : sensorEntity.rootTopic,
    isValueProcessing : !!sensorEntity.isValueProcessing
});
