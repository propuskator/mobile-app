import { StyleSheet } from 'react-native';

import colors         from '../../../../new-assets/constants/colors';

export default (mode) => StyleSheet.create({
    container : {
        flex           : 1,
        justifyContent : 'flex-start',
        alignItems     : 'center',
        width          : '100%',
        height         : '100%'
    },
    inputsWrapper : {
        flex  : 1,
        width : '100%'
    },
    checkboxWrapper : {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        alignSelf      : 'flex-end',
        padding        : 2  // fix iPhone 7 bug
    },
    checkboxTitleContainer : {
        flex : 1
    },
    checkboxTitle : {
        fontSize : 12,
        color    : colors[mode].TEXT_PRIMARY
    },
    checkboxLink : {
        color              : colors[mode].PRIMARY,
        textDecorationLine : 'underline',
        fontSize           : 12
    },
    checkboxErrorText : {
        width     : '100%',
        color     : colors[mode].ERROR,
        minHeight : 33,
        fontSize  : 12,
        marginTop : 5
    }
});
