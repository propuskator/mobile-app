import { StyleSheet } from 'react-native';
import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    containerStyles : {
        display         : 'flex',
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        borderWidth     : 1,
        borderColor     : colors[mode].LINE,
        backgroundColor : colors[mode].ITEM_BG,
        width           : '100%',
        padding         : 25,
        marginBottom    : 15
    },
    dataContainer : {
        paddingHorizontal : 20,
        flex              : 1
    },
    bold : {
        fontWeight    : '600',
        fontSize      : 16,
        paddingBottom : 5,
        color         : colors[mode].TEXT_PRIMARY
    },
    bolder : {
        fontWeight : '600',
        color      : colors[mode].TEXT_PRIMARY

    },
    icon : {
        paddingRight : 5,
        width        : 50,
        height       : 50
    },
    text : {
        color : colors[mode].TEXT_PRIMARY
    },
    imagePlaceholderStyles : {
        backgroundColor : colors[mode].ITEM_BG
    },
    avatar : {
        width        : 54,
        height       : 54,
        borderRadius : 50
    }
});
