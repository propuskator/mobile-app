import { StyleSheet } from 'react-native';
import { wh }         from '../../../../utils/platform';
import colors         from '../../../../new-assets/constants/colors';


export default (mode) => StyleSheet.create({
    mainContainer : {
        flex     : 1,
        overflow : 'hidden'
    },
    container : {
        height : 'auto',
        width  : '100%'
    },
    scroll : {
        height : '100%',
        width  : '100%'
    },
    modalTitle : {
        fontSize   : 14,
        fontWeight : '700'
    },
    loaderWrapper : {
        alignItems     : 'center',
        justifyContent : 'center',
        flex           : 1
    },
    groupsWrapper : {
        display       : 'flex',
        flexDirection : 'row',
        flexWrap      : 'wrap',
        height        : 'auto',
        width         : '100%',
        maxWidth      : 360,
        marginLeft    : 'auto',
        marginRight   : 'auto',
        marginBottom  : 10
    },
    groupWrapper : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        width          : '33%',
        height         : wh * 0.15,
        maxHeight      : 120
    },
    colorOptions : {
        display        : 'flex',
        justifyContent : 'space-between',
        flexDirection  : 'row',
        flexWrap       : 'wrap',
        alignSelf      : 'center',
        height         : 'auto',
        width          : '100%',
        maxWidth       : 360,
        marginLeft     : -8,
        marginRight    : -8,
        marginTop      : 20
        // marginBottom   : 80
    },
    colorOptionWrapper : {
        position     : 'relative',
        width        : 39,
        height       : 39,
        marginLeft   : 8,
        marginRight  : 8,
        marginBottom : 20
    },
    colorOption : {
        width        : '100%',
        height       : '100%',
        borderRadius : 25
    },
    selectedOption : {
        position     : 'absolute',
        top          : -5,
        right        : -5,
        left         : -5,
        bottom       : -5,
        borderWidth  : 3,
        borderRadius : 28,
        opacity      : 0.5
    },
    sectionCaption : {
        fontWeight : '500'
    },
    footer : {
        paddingTop      : 20,
        paddingBottom   : 10,
        backgroundColor : colors[mode].BACKGROUND
    }
});
