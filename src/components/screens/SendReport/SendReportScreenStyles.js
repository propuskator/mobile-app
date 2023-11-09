import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';
import { wh }         from '../../../utils/platform';


export default mode => StyleSheet.create({
    container : {
        flex              : 1,
        backgroundColor   : colors[mode].BACKGROUND,
        paddingHorizontal : 20
    },
    scrollContentStyle : {
        minWidth       : '100%',
        justifyContent : 'space-between',
        flexGrow       : 1
    },
    description : {
        fontSize     : 12,
        marginBottom : 0,
        textAlign    : 'center'
    },
    inputContainer : {
        height : 0.25 * wh
    },
    submitButton : {
        marginBottom : 20
    }
});
