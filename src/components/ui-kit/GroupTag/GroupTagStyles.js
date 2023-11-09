import { StyleSheet }      from 'react-native';

import colors              from '../../../assets/constants/colors';
import { ww }              from '../../../utils/platform';


export default mode => StyleSheet.create({
    container : {
        position       : 'relative',
        display        : 'flex',
        justifyContent : 'center',
        alignItems     : 'center',
        minWidth       : Math.round((ww - 50) / 4.5),
        padding        : 8
    },
    circle : {
        position       : 'relative',
        display        : 'flex',
        justifyContent : 'center',
        alignItems     : 'center',
        width          : 56,
        height         : 56,
        borderRadius   : 28
    },
    circeSizeM : {
        width        : 76,
        height       : 76,
        borderRadius : 39
    },
    logoLetter : {
        fontSize      : 21,
        textTransform : 'capitalize',
        color         : '#FFFFFF',
        fontWeight    : '600'
    },
    selectedCircle : {
        position     : 'absolute',
        width        : 68,
        height       : 68,
        borderRadius : 36,
        borderColor  : colors[mode].DARK_GREEN,
        borderWidth  : 3
    },
    selectedCircleSizeM : {
        top          : -6,
        left         : -6,
        width        : 88,
        height       : 88,
        borderRadius : 45
    },
    outlined : {
        borderColor     : colors[mode].DARK_GRAY,
        borderWidth     : 1,
        backgroundColor : '#FFFFFF'
    },
    filled : {
        backgroundColor : colors[mode].LOGO_DEFAULT_COLOR
    },
    addFilled : {
        borderColor : colors[mode].DARK_GRAY,
        borderWidth : 1
    },
    label : {
        width     : '100%',
        marginTop : 7,
        textAlign : 'center',
        color     : mode === 'light' ? colors[mode].DARK_GRAY : colors[mode].TEXT_PRIMARY,
        fontSize  : 14
    },
    icon : {
        maxWidth : '100%',
        height   : '100%'
    },
    iconSizeM : {
        maxWidth  : 40,
        maxHeight : 40
    },
    loaderWrapper : {
        position       : 'absolute',
        top            : 0,
        left           : 0,
        width          : '100%',
        height         : '100%',
        display        : 'flex',
        justifyContent : 'center',
        alignItems     : 'center'
    }
});
