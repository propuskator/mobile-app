import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        display           : 'flex',
        flexDirection     : 'row',
        alignItems        : 'center',
        justifyContent    : 'space-between',
        backgroundColor   : colors[mode].ITEM_BG,
        width             : '100%',
        paddingHorizontal : 15,
        paddingVertical   : 10
    },
    sizeS : {
        minHeight : 63
    },
    sizeM : {
        minHeight : 75
    },
    sizeL : {
        minHeight : 80
    },
    greyLight : {
        backgroundColor : colors[mode].BACKGROUND_SECONDARY
    },
    disabled : {
        opacity : 0.5
    },
    transparent : {
        backgroundColor : 'transparent'
    },
    leftPart : {
        flex           : 1,
        flexShrink     : 0,
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'flex-start'
    },
    rightPart : {
        flex           : 1,
        flexShrink     : 0,
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'flex-end'
    },
    rightPartWithToggle : {
        flexGrow : 0,
        minWidth : 60
    },
    onlyArrow : {
        minWidth : 20,
        flexGrow : 0
    },
    title : {
        fontSize : 16,
        color    : colors[mode].TEXT_PRIMARY,
        maxWidth : '85%'
    },
    subtitle : {
        fontSize  : 14,
        marginTop : 0,
        color     : colors[mode].TEXT_SECONDARY
    },
    iconWrapper : {
        width          : 40,
        height         : 40,
        marginRight    : 20,
        alignItems     : 'center',
        justifyContent : 'center',
        marginTop      : -10,
        marginBottom   : -10
    },
    image : {
        width        : 40,
        height       : 40,
        borderRadius : 20
    },
    textWrapper : {
        flex           : 1,
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'flex-start'
    },
    withSubtitle : {
        flexDirection  : 'column',
        alignItems     : 'flex-start',
        justifyContent : 'center'
    },
    valueWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    value : {
        color       : colors[mode].TEXT_SECONDARY,
        fontSize    : 16,
        marginRight : 10
    },
    arrowIcon : {
        marginLeft : 10
    }
});
