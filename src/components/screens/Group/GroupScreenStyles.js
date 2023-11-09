import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        flex              : 1,
        backgroundColor   : colors[mode].BACKGROUND,
        paddingHorizontal : 16,
        paddingVertical   : 20
    },
    groupBlock : {
        paddingHorizontal : 16,
        paddingVertical   : 16,
        alignItems        : 'center'
    },
    inputContainer : {
        paddingTop : 0,
        marginTop  : 0
    },
    groupInputContainer : {
        backgroundColor : colors[mode].BACKGROUND,
        marginTop       : 0
    },
    inputError : {
        display : 'none'
    },
    listWrapper : {
        marginTop : 31,
        flex      : 1
    },
    listTitle : {
        fontWeight   : '500',
        marginBottom : 8
    },
    scroll : {
        marginRight : -16
    },
    accessPointContainer : {
        flexDirection   : 'row',
        justifyContent  : 'space-between',
        alignItems      : 'center',
        minHeight       : 56,
        paddingVertical : 17,
        paddingRight    : 17
    },
    accessPointName : {
        flex        : 1,
        marginRight : 15,
        fontWeight  : '500'
    }
});
