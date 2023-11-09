import { StyleSheet } from 'react-native';

import colors from '../../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        backgroundColor : colors[mode].BACKGROUND,
        height          : '100%'
    },
    contentContainer : {
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 20,
        paddingTop      : 0,
        paddingBottom   : 30,
        flex            : 1,
        justifyContent  : 'flex-end',
        alignItems      : 'center',
        width           : '100%'
    },
    borderedBlock : {
        marginTop         : 12,
        paddingHorizontal : 0,
        width             : '100%'
    },
    blockTitle : {
        paddingHorizontal : 16,
        paddingTop        : 16,
        fontWeight        : '700'
    },
    divider : {
        marginLeft  : 0,
        marginRight : 0
    },
    customBlock : {
        display       : 'flex',
        flexDirection : 'row',
        width         : '100%',
        paddingTop    : 12,
        paddingBottom : 12
    },
    leftPart : {
        flexGrow          : 1,
        flexShrink        : 1,
        alignItems        : 'flex-start',
        justifyContent    : 'center',
        paddingHorizontal : 16

    },
    rightPart : {
        flexGrow       : 0,
        flexShrink     : 0,
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        paddingRight   : 16
    },
    phoneWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'flex-start'
    }
});
