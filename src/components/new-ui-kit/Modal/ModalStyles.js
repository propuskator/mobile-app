
import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default  (mode) => StyleSheet.create({
    modalContainer : {
        flex           : 1,
        justifyContent : 'flex-end'
    },
    overlay : {
        backgroundColor : colors[mode].MODAL_OVERLAY,
        position        : 'absolute',
        top             : 0,
        left            : 0,
        right           : 0,
        bottom          : 0
    },
    draggableAreaWrapper : {
        width         : '100%',
        alignItems    : 'center',
        paddingTop    : 10,
        paddingBottom : 10,
        zIndex        : 10
    },
    draggableArea : {
        width           : 30,
        backgroundColor : 'rgba(203, 205, 204, 0.5)',
        height          : 3
    },
    headerWrapper : {
        display        : 'flex',
        justifyContent : 'flex-start',
        alignItems     : 'flex-start',
        flexDirection  : 'row',
        paddingBottom  : 15
    },
    header : {
        alignSelf  : 'center',
        fontWeight : '700',
        fontSize   : 20,
        lineHeight : 22,
        flex       : 1,
        textAlign  : 'left'
    },
    centeredTitle : {
        textAlign : 'center'
    },
    container : {
        backgroundColor      : colors[mode].BACKGROUND,
        height               : 400,
        padding              : 16,
        paddingTop           : 0,
        borderTopRightRadius : 12,
        borderTopLeftRadius  : 12
    },
    leftIconWrapper : {
        justifyContent : 'center',
        alignItems     : 'center',
        width          : 30,
        height         : 30
    },
    rightIconWrapper : {
        justifyContent : 'center',
        alignItems     : 'flex-end',
        width          : 30,
        height         : 30
    }
});
