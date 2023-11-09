import { StyleSheet } from 'react-native';
import colors                   from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        position        : 'absolute',
        zIndex          : 10000,
        top             : 0,
        bottom          : 0,
        left            : 0,
        right           : 0,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : colors[mode].BACKGROUND,
        paddingTop      : 60
    },
    info : {
        color       : colors[mode].TEXT_SECONDARY,
        textAlign   : 'center',
        paddingLeft : 10,
        paddingTop  : 5,
        fontSize    : 16
    },
    title : {
        fontSize     : 35,
        fontWeight   : '600',
        color        : colors[mode].TEXT_PRIMARY,
        top          : -80,
        marginBottom : 80,
        marginTop    : 10
    }
});
