import { StyleSheet }   from 'react-native';
import colors           from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex              : 1,
        flexDirection     : 'column',
        justifyContent    : 'space-between',
        backgroundColor   : colors[mode].BACKGROUND,
        paddingHorizontal : 16,
        paddingBottom     : 16
    },
    scroll : {
        marginRight : -15
    },
    headerOptionsIcon : {
        marginRight : 13
    },
    listContainer : {
        marginTop : 12
    },
    groupItemContainer : {
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        minHeight       : 64,
        paddingVertical : 12,
        paddingRight    : 15
    },
    groupItemCircle : {
        position       : 'relative',
        display        : 'flex',
        justifyContent : 'center',
        alignItems     : 'center',
        width          : 40,
        height         : 40,
        borderRadius   : 20
    },
    groupItemName : {
        marginHorizontal : 12,
        flex             : 1,
        fontWeight       : '500'
    },
    logoLetter : {
        color : mode === 'dark' ? '#000' : '#FFF'
    }
});
