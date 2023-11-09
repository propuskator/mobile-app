import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : 'transparent',
        padding         : 12,
        position        : 'absolute',
        zIndex          : 10,
        width           : '100%',
        height          : 40
    },
    text : {
        fontSize   : 16,
        lineHeight : 16,
        color      : colors[mode].TEXT_CONTRAST
    }
});
