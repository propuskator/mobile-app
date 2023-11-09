import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    pressableWrapper : {
        flex  : 1,
        width : '100%'
    },
    mainWrapper : {
        flex  : 1,
        width : '100%'
    },
    maincontainer : {
        backgroundColor : colors[mode].BACKGROUND
    },
    container : {
        flex              : 1,
        width             : '100%',
        alignItems        : 'center',
        justifyContent    : 'center',
        backgroundColor   : colors[mode].BACKGROUND,
        padding           : 20,
        paddingTop        : 10,
        paddingHorizontal : 10
    },
    footer : {
        padding         : 20,
        width           : '100%',
        backgroundColor : colors[mode].BACKGROUND
    },
    title : {
        fontWeight : '700',
        marginTop  : 15,
        fontSize   : 16
    },
    description : {
        marginVertical : 12,
        fontSize       : 14
    },
    text : {
        maxWidth  : '100%',
        fontSize  : 16,
        color     : colors[mode].TEXT_PRIMARY,
        textAlign : 'center'
    }
});
