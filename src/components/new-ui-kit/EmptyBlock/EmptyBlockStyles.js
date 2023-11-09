import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex           : 1,
        alignItems     : 'center',
        justifyContent : 'center'
    },
    emptyTextContainer : {
        maxWidth       : '100%',
        alignItems     : 'center',
        justifyContent : 'space-between',
        flexDirection  : 'column',
        marginBottom   : 20
    },
    emptyTitle : {
        maxWidth     : '100%',
        fontSize     : 16,
        fontWeight   : 'bold',
        marginTop    : 20,
        marginBottom : 10,
        color        : colors[mode].TEXT_PRIMARY,
        textAlign    : 'center'
    },
    emptySubtitle : {
        maxWidth   : '100%',
        fontSize   : 14,
        lineHeight : 20,
        color      : colors[mode].TEXT_SECONDARY,
        textAlign  : 'center'
    },
    scroll : {
        height : '100%',
        width  : '100%'
    },
    emptyIcon : {
        marginTop : -60
    }
});
