import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex              : 1,
        backgroundColor   : colors[mode].BACKGROUND_SECONDARY,
        paddingHorizontal : 16
    },
    block : {
        flexDirection     : 'row',
        justifyContent    : 'space-between',
        alignItems        : 'center',
        paddingVertical   : 14,
        paddingHorizontal : 30,
        marginTop         : 20,
        borderRadius      : 11,
        backgroundColor   : colors[mode].BACKGROUND
    },
    blockLeft : {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center'
    },
    title : {
        color      : colors[mode].TEXT_PRIMARY,
        marginLeft : 10
    }
});
