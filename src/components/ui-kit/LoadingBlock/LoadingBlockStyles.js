import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        width           : '100%',
        height          : '100%',
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : colors[mode].BACKGROUND,
        opacity         : 0.4
    },
    loadingText : {
        color       : colors[mode].TEXT_PRIMARY,
        textAlign   : 'center',
        fontWeight  : 'bold',
        paddingLeft : 10,
        opacity     : 1,
        paddingTop  : 5,
        fontSize    : 16
    },
    overlay : {
        position : 'absolute',
        top      : 0,
        left     : 0,
        right    : 0,
        bottom   : 0
    }
});
