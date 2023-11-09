import { StyleSheet } from 'react-native';

import colors from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        height          : 60,
        width           : '100%',
        borderRadius    : 3,
        backgroundColor : colors[mode].ITEM_BG,
        padding         : 16,
        paddingRight    : 0,
        marginVertical  : 10,
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-between'
    },
    nameWrapper : {
        flex          : 1,
        flexDirection : 'row',
        alignItems    : 'center'
    },
    name : {
        flex     : 1,
        color    : colors[mode].TEXT_PRIMARY,
        fontSize : 16
    },
    checkboxWrapper : {
        height         : 50,
        width          : 60,
        justifyContent : 'center',
        alignItems     : 'center'
    }
});

