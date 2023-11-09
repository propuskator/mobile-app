import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        position : 'absolute',
        zIndex   : 100,
        width    : '100%',
        height   : '100%'
    },
    shadowBlock : {
        flex            : 1,
        position        : 'absolute',
        zIndex          : 2000,
        top             : 0,
        left            : 0,
        right           : 0,
        bottom          : 0,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : colors[mode].BACKGROUND,
        opacity         : 0.95,
        paddingTop      : 60
    },
    text : {
        textAlign  : 'center',
        fontSize   : 18,
        fontWeight : 'bold',
        position   : 'relative',
        color      : colors[mode].TEXT_PRIMARY
    }
});
