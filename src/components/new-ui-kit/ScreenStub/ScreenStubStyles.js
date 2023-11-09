import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    emptyContainer : {
        flex              : 1,
        alignItems        : 'center',
        justifyContent    : 'center',
        paddingHorizontal : 15,
        marginTop         : -40
    },
    emptyIcon : {
        marginTop    : -30,
        marginBottom : 20,
        position     : 'relative',
        zIndex       : 1
    },
    emptyTextContainer : {
        width             : '100%',
        alignItems        : 'center',
        justifyContent    : 'space-between',
        paddingHorizontal : 24
    },
    emptyTitle : {
        marginBottom : 12,
        color        : colors[mode].TEXT_PRIMARY,
        textAlign    : 'center'
    },
    emptySubtitle : {
        textAlign : 'center'
    },
    buttonContainer : {
        marginTop : 24
    }
});
