import TouchID                              from 'react-native-touch-id';

import { isIOS }                            from '../utils/platform';

import Storage                              from './AsyncStorage';


export async function checkBiometricPermission() {
    const isBiometricEnabled = await checkisBiometricEnabled();
    const isBiometrySupported =  await checkIsBiometrySupported();


    return isBiometricEnabled && isBiometrySupported;
}

export async function checkIsBiometryWasRequested() {
    const isBiometryRequested = await Storage.getItem('isBiometryRequested');

    return isBiometryRequested;
}

export async function setIsBiometryWasRequested(isRequested) {
    await Storage.setItem('isBiometryRequested', isRequested);
}

export async function checkisBiometricEnabled() {
    const isBiometricEnabled = await Storage.getItem('isBiometricEnabled');


    return isBiometricEnabled;
}

export async function checkIsBiometrySupported() {
    const isBiometrySupported =  await Storage.getItem('isBiometrySupported') ||  null;

    return isBiometrySupported;
}

export async function getBiometryType() {
    const biometryType = await Storage.getItem('biometryType') || 'Biometric';

    return biometryType;
}

export async function setBiometricPermission({ isEnable = true, biometricToken = '' }) {
    await Storage.setItem('isBiometricEnabled', isEnable);
    await Storage.setItem('biometricToken', biometricToken);
}

export async function setBiometrySupportedToStorage() {
    try {
        // needed to check biometry support
        await  TouchID.isSupported({});
        const biometryType = isIOS ? await  TouchID.isSupported({}) : 'TouchID';

        await Storage.setItem('biometryType', biometryType);
        await Storage.setItem('isBiometrySupported', true);
    } catch (err) {
        Storage.setItem('biometryType', '');
        Storage.setItem('isBiometrySupported', false);
    }
}


export async function requestEnableBiometric() {
    const isBiometrySupported = await Storage.getItem('isBiometrySupported') || false;

    if (isBiometrySupported) {
        try {
            await  TouchID.authenticate('', {
                fallbackLabel : ''
            });
            await setBiometricPermission({  isEnable: true });
        } catch (err) {
            throw err;
        }
    }
}
