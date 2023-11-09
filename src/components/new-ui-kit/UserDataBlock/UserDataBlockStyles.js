import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        width : '100%'
    },
    containerStyles : {
        display         : 'flex',
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        width           : '100%',
        paddingVertical : 16
    },
    dataContainer : {
        flex              : 1,
        paddingHorizontal : 10
    },
    bold : {
        fontWeight    : '600',
        fontSize      : 16,
        paddingBottom : 5,
        color         : colors[mode].TEXT_PRIMARY
    },
    bolder : {
        fontWeight : '600'
    },
    icon : {
        paddingRight : 5,
        width        : 50,
        height       : 50
    },
    text : {
        color         : colors[mode].TEXT_SECONDARY,
        fontSize      : 12,
        shadowOpacity : 0
    },
    imagePlaceholderStyles : {
        backgroundColor : colors[mode].ITEM_BG
    },
    avatar : {
        width        : 54,
        height       : 54,
        borderRadius : 50
    },
    avatarWrapper : {
        width          : 60,
        alignItems     : 'center',
        justifyContent : 'center'
    },
    iconWrapper : {
        position : 'absolute',
        bottom   : -3,
        right    : -4,
        padding  : 1
    },
    deleteIconWrapper : {
        padding : 10
    }
});
