import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        alignItems      : 'center',
        justifyContent  : 'flex-start',
        backgroundColor : colors[mode].BACKGROUND,
        padding         : 20,
        paddingVertical : 15
    },
    fullscreenContainer : {
        justifyContent : 'center'
    },
    openButtonWrapper : {
        width           : '100%',
        paddingVertical : 16,
        paddingBottom   : 0
    },
    borderedBlock : {
        marginTop : 16,
        width     : '100%'
    },
    block : {
        height          : 48,
        paddingVertical : 0,
        paddingBottom   : 0
    },
    blockContent : {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        width          : '100%',
        marginBottom   : 15
    },
    blockValueWrapper : {
        flexDirection  : 'row',
        justifyContent : 'flex-end',
        alignItems     : 'center'
    },
    stateIcon : {
        marginRight : 7
    }
});
