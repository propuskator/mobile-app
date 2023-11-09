import { StyleSheet } from 'react-native';

import colors         from '../../../../new-assets/constants/colors';

export default (mode) => StyleSheet.create({
    container : {
        flexDirection   : 'row',
        width           : '100%',
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : 60,
        paddingTop      : 10,
        backgroundColor : colors[mode].BACKGROUND
    },
    content : {
        flexDirection  : 'row',
        width          : '100%',
        justifyContent : 'center',
        alignItems     : 'center',
        height         : 50
    },
    leftBar : {
        position       : 'absolute',
        top            : 10,
        left           : -10,
        height         : 30,
        display        : 'flex',
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center'
    },
    rightBar : {
        position       : 'absolute',
        top            : 10,
        right          : -5,
        height         : 30,
        display        : 'flex',
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center'
    },
    backIcon : {
        transform : [ { rotateZ: '180deg' } ]
    }
});
