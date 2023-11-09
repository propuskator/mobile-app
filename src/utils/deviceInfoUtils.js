/* eslint-disable newline-after-var */
import DeviceInfo from 'react-native-device-info';

function getDeviceInfo() {
    return {
        app             : DeviceInfo.getApplicationName(),
        version         : DeviceInfo.getVersion(),
        build           : DeviceInfo.getBuildNumber(),
        os              : DeviceInfo.getSystemName(),
        osVersion       : DeviceInfo.getSystemVersion(),
        model           : DeviceInfo.getModel(),
        id              : DeviceInfo.getUniqueId(),
        brend           : DeviceInfo.getBrand(),
        deviceHaveNotch : DeviceInfo.hasNotch()
    };
}

const INFO = getDeviceInfo();

export function getDeviceInfoString() {
    let info = '';

    info += `App:${INFO.app}; `;
    info += `App-version:${INFO.version}; `;
    info += `App-build:${INFO.build}; `;
    info += `OS:${INFO.os}; `;
    info += `OS-version:${INFO.osVersion}; `;
    info += `Model:${INFO.model}; `;
    info += `ID:${INFO.id};`;

    return info;
}

export default INFO;
