import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        position          : 'relative',
        flex              : 1,
        zIndex            : 1,
        paddingHorizontal : 15,
        paddingBottom     : 15
    },
    heading : {
        position       : 'relative',
        height         : 45,
        width          : '100%',
        alignItems     : 'flex-end',
        justifyContent : 'center'
    },
    controlsWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        justifyContent : 'flex-end'
    },
    logoWrapper : {
        position : 'absolute',
        top      : 5,
        left     : -17
    },
    editControl : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        marginLeft     : 10,
        minWidth       : 40
    },
    loaderWrapper : {
        position        : 'absolute',
        top             : 0,
        left            : 0,
        width           : '100%',
        height          : '100%',
        flex            : 1,
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : 'transparent'
    },
    loadingContainer : {
        flex           : 1,
        position       : 'absolute',
        top            : 0,
        left           : 0,
        right          : 0,
        bottom         : 0,
        width          : '100%',
        height         : '100%',
        alignItems     : 'center',
        justifyContent : 'center',
        opacity        : 0.4
    },
    loadingText : {
        color       : colors[mode].TEXT_PRIMARY,
        textAlign   : 'center',
        fontWeight  : 'bold',
        paddingLeft : 10,
        opacity     : 1,
        paddingTop  : 5,
        fontSize    : 16
    },
    searchWrapper : {
        width         : '100%',
        flexDirection : 'row',
        alignItems    : 'center'
    },
    searchView : {
        width          : '100%',
        height         : 43,
        alignItems     : 'flex-start',
        justifyContent : 'center'
    },
    closeIcon : {
        marginLeft : 10
    },
    groupsWrapper : {
        marginTop  : 15,
        marginLeft : -11
    },
    accessPointsWrapper : {
        position : 'relative',
        flex     : 1
    }
});
