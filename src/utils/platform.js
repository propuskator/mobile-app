/* eslint-disable more/no-numeric-endings-for-variables */
import {
    Dimensions,
    Platform,
    StatusBar
}                 from 'react-native';
import DeviceInfo from './deviceInfoUtils';

const windowContainer = Dimensions.get('window');

export const ww           = windowContainer.width;
export const wh           = windowContainer.height;
export const isIOS        = Platform.OS === 'ios';
export const isAndroid    = Platform.OS === 'android';

export const isWidth320   = ww === 320;
export const isWidth375   = ww === 375;
export const isWidth414   = ww === 414;

export const smallWidth   = ww <= 320;
export const mediumWidth  = ww > 320 && ww <= 375;
export const largeWidth   = ww > 375 && ww <= 414;
export const xLargeWidth  = ww > 414;

export const smallHeight   = wh <= 592;
export const mediumHeight  = wh > 592 && wh <= 667;
export const largeHeight   = wh > 667 && wh <= 736;
export const xLargeHeight  = wh > 736 && wh <= 935;
export const xxLargeHeight = wh > 935;

export const isIPhone4    = isIOS && ww === 320 && wh === 480;
export const isIPhone4s   = isIPhone4;

export const isIPhone5    = isIOS && ww === 320 && wh === 568;
export const isIPhone5s   = isIPhone5;
export const isIPhone5c   = isIPhone5;
export const isIPhoneSE   = isIPhone5;

export const isIPhone6    = isIOS && ww === 375 && wh === 667;
export const isIPhone6s   = isIPhone6;
export const isIPhone7    = isIPhone6;
export const isIPhone8    = isIPhone6;

export const isIPhone6p   = isIOS && ww === 414 && wh === 736;
export const isIPhone6sp  = isIPhone6p;
export const isIPhone7p   = isIPhone6p;
export const isIPhone8p   = isIPhone6p;

export const isIPhoneX    = isIOS && ww === 375 && wh === 812;

export const isIPad       = isIOS && (wh / ww) <= 1.6;

export function getStatusBarHeigt() {
    let statusBarHeight;

    if (isIOS) {
        statusBarHeight = DeviceInfo.deviceHaveNotch ? 44 : 20;
    } else if (Platform.OS === 'android') {
        statusBarHeight = StatusBar.currentHeight + 15;
    }

    return statusBarHeight;
}

export function getStatusBarPadding() {
    let calculatedHeight;

    if (isIOS) {
        calculatedHeight = DeviceInfo.deviceHaveNotch ?  26 : 11;
    } else if (Platform.OS === 'android') {
        calculatedHeight = StatusBar.currentHeight;
    }

    return calculatedHeight;
}

export default {
    ww,
    wh,

    isIOS,
    isAndroid,

    isWidth320,
    isWidth375,
    isWidth414,

    smallWidth,
    mediumWidth,
    largeWidth,
    xLargeWidth,

    isIPhone4,
    isIPhone4s,

    isIPhone5,
    isIPhone5s,
    isIPhone5c,
    isIPhoneSE,

    isIPhone6,
    isIPhone6s,
    isIPhone7,
    isIPhone8,

    isIPhone6p,
    isIPhone6sp,
    isIPhone7p,
    isIPhone8p,

    isIPhoneX,

    isIPad
};
