import { setInitialLanguage }               from '../utils/storage/settingsHelper';
import {
    setBiometrySupportedToStorage,
    checkBiometricPermission
}                                           from '../utils/TouchId';
import { getHideGroupsFromStorage }         from '../utils/storage/Interface';

import * as NavigationHelper                from '../utils/NavigationHelper';
import screens                                from '../new-assets/constants/screens';
import { checkSession }                     from './session';
import { updateBiometricSetting,
    toggleHigeGroups
}                                           from './users';
import { getDevices }                       from './homie/homie';
import { getAccessPoints }                  from './accessPoints';


export function initialFetch() {
    return async (dispatch) => {
        const isBiometricAvailable = await checkBiometricPermission();

        if (isBiometricAvailable)  NavigationHelper.replace(screens.LOGIN);

        await dispatch(checkSession());
    };
}

export function setInitialDataFromStorage() {
    return async (dispatch) => {
        const isBiometricEnable = await checkBiometricPermission();

        dispatch(updateBiometricSetting({ isBiometricEnable }));
        await setBiometrySupportedToStorage();

        await setInitialLanguage();
        const hideGroups = await getHideGroupsFromStorage();

        dispatch(toggleHigeGroups(hideGroups));
    };
}

export function reconectAfterConectLost() {
    return async (dispatch) => {
        await dispatch(getAccessPoints());
        await dispatch(getDevices());
    };
}
