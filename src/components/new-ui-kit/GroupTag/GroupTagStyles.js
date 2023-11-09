import { StyleSheet }      from 'react-native';

import colors              from '../../../new-assets/constants/colors';
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
        borderColor  : colors[mode].PRIMARY,
        borderWidth  : 3,
        opacity      : 0.5
    },
    selectedCircleSizeM : {
        top          : -6,
        left         : -6,
        width        : 88,
        height       : 88,
        borderRadius : 45
    },
    dashed : {
        borderColor     : colors[mode].INPUT_COLOR,
        borderWidth     : 1,
        backgroundColor : colors[mode].BACKGROUND,
        borderStyle     : 'dashed'
    },
    outlined : {
        borderColor     : colors[mode].PRIMARY,
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
    editIconContainer : {
        position        : 'absolute',
        bottom          : 0,
        right           : 0,
        padding         : 6,
        backgroundColor : colors[mode].ITEM_BG,
        borderRadius    : 15,
        shadowColor     : '#000',
        shadowOffset    : {
            width  : 0,
            height : 1
        },
        shadowOpacity : 0.20,
        shadowRadius  : 1.41,
        elevation     : 2
    },
    label : {
        width     : '100%',
        marginTop : 7,
        textAlign : 'center',
        color     : colors[mode].TEXT_SECONDARY,
        fontSize  : 13
    },
    selectedLabel : {
        color : colors[mode].TEXT_PRIMARY
    },
    icon : {
        maxWidth : '100%',
        height   : '100%'
    },
    iconSizeM : {
        maxWidth  : 76,
        maxHeight : 76
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
