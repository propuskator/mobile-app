import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    pressableWrapper : {
        flex  : 1,
        width : '100%'
    },
    container : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'flex-end',
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 10
    },
    wrapper : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        minHeight       : 300,
        paddingVertical : 10,
        justifyContent  : 'space-between'
    },
    listContainer : {
        height : 'auto'
    },
    scroll : {
        height            : '100%',
        width             : '100%',
        paddingHorizontal : 10
    },
    accessTokensError : {
        height       : 'auto',
        minHeight    : 15,
        margin       : 3,
        color        : colors[mode].ERROR,
        fontSize     : 12,
        textAlign    : 'center',
        marginBottom : -3
    }
});
