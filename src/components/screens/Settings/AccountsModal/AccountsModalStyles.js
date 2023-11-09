import { StyleSheet } from 'react-native';

import colors from '../../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        backgroundColor : colors[mode].BACKGROUND,
        height          : '100%'
    },
    contentContainer : {
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 20,
        paddingTop      : 0,
        flex            : 1,
        justifyContent  : 'flex-start',
        alignItems      : 'center',
        width           : '100%'
    },
    accoutsContainer : {
        width : '100%'
    },
    listWrapper : {
        width : '100%',
        flex  : 1
    },
    scroll : {
        width  : '100%',
        height : 200
    },
    divider : {
        marginLeft  : 0,
        marginRight : 0,
        width       : '100%'
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
    },
    addAccountButton : {
        display         : 'flex',
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'flex-start',
        width           : '100%',
        paddingVertical : 20
    },
    addText : {
        color : colors[mode].PRIMARY
    },
    addIconWrapper : {
        width          : 50,
        height         : 50,
        borderRadius   : 25,
        borderWidth    : 1,
        marginRight    : 12,
        borderColor    : colors[mode].PRIMARY,
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    accountBlock : {
        backgroundColor : colors[mode].BACKGROUND
    }
});
