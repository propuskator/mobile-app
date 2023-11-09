import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';
import { wh }         from '../../../utils/platform';

export default mode => StyleSheet.create({
    pressableWrapper : {
        flex  : 1,
        width : '100%'
    },
    container : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'flex-end',
        backgroundColor : colors[mode].BACKGROUND
    },
    scroll : {
        height : '100%',
        width  : '100%'
    },
    wrapper : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        minHeight       : 300,
        paddingVertical : 15,
        justifyContent  : 'space-between'
    },
    groupsContainer : {
        height : '100%',
        width  : '100%'
    },
    groupsList : {
        flex     : 1,
        height   : 'auto',
        width    : '100%',
        maxWidth : '100%'
    },
    groupsWrapper : {
        display       : 'flex',
        flexDirection : 'row',
        flexWrap      : 'wrap',
        height        : 'auto',
        width         : '100%',
        maxWidth      : 360,
        marginLeft    : 'auto',
        marginRight   : 'auto'
    },
    groupWrapper : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        width          : '33%',
        height         : wh * 0.15,
        maxHeight      : 120
    },
    group : {
        width  : 77,
        height : 77
    },
    button : {
        width             : '100%',
        marginTop         : 10,
        paddingHorizontal : 10
    },
    title : {
        display     : 'flex',
        alignSelf   : 'flex-start',
        fontSize    : 14,
        textAlign   : 'left',
        color       : colors[mode].TEXT_PRIMARY,
        paddingLeft : 20,
        marginTop   : 20
    },
    errorTitle : {
        color : colors[mode].ERROR
    },
    colorOptions : {
        display        : 'flex',
        justifyContent : 'space-between',
        flexDirection  : 'row',
        flexWrap       : 'wrap',
        height         : 'auto',
        width          : '100%',
        maxWidth       : 360,
        marginLeft     : 'auto',
        marginRight    : 'auto',
        marginTop      : 20
    },
    colorOptionWrapper : {
        position : 'relative',
        width    : 42,
        height   : 42
    },
    colorOption : {
        width        : '100%',
        height       : '100%',
        borderRadius : 21
    },
    selectedIcon : {
        position : 'absolute',
        top      : 16,
        left     : 12
    }
});
