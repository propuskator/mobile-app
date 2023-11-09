import { StyleSheet }   from 'react-native';

import colors           from '../../../new-assets/constants/colors';
import {
    getStatusBarHeigt,
    getStatusBarPadding
}                       from '../../../utils/platform';


export default mode => StyleSheet.create({
    container : {
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : 'transparent',
        position        : 'absolute',
        zIndex          : 10,
        width           : '100%',
        height          : getStatusBarHeigt() + 21 // 28
    },
    text : {
        fontSize   : 16,
        paddingTop : getStatusBarPadding(),
        color      : colors[mode].TEXT_PRIMARY
    }
});
