import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        position : 'absolute',
        zIndex   : 1,
        width    : '100%',
        height   : '100%'
    },
    shadowBlock : {
        position          : 'absolute',
        zIndex            : 1,
        width             : '100%',
        height            : '100%',
        backgroundColor   : colors[mode].NO_CONNECTION_BG,
        justifyContent    : 'center',
        alignItems        : 'center',
        paddingHorizontal : 20
    },
    text : {
        textAlign  : 'center',
        fontSize   : 18,
        fontWeight : 'bold',
        position   : 'relative',
        color      : colors[mode].TEXT_PRIMARY
    }
});
