import { StyleSheet } from 'react-native';

import colors         from '../../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        flex  : 1,
        width : '100%'
    },
    contentContainer : {
        flex           : 1,
        width          : '100%',
        height         : '100%',
        alignItems     : 'center',
        justifyContent : 'space-between'
    },
    shadow : {
        flex           : 1,
        position       : 'absolute',
        zIndex         : 2000,
        elevation      : 2,
        top            : 0,
        left           : 0,
        right          : 0,
        bottom         : 0,
        width          : '100%',
        alignItems     : 'center',
        justifyContent : 'center',
        opacity        : 0.95,
        paddingTop     : 60
    },
    accessPointsContainer : {
        minHeight     : '100%',
        paddingBottom : 60
    },
    spinner : {
        flex           : 1,
        alignItems     : 'center',
        justifyContent : 'center'
    },
    emptyTextContainer : {
        width          : '98%',
        alignItems     : 'center',
        justifyContent : 'space-between',
        flexDirection  : 'column',
        marginBottom   : 20
    },
    emptyTitle : {
        fontSize     : 20,
        fontWeight   : 'bold',
        marginBottom : 12,
        color        : colors[mode].TEXT_PRIMARY,
        textAlign    : 'center'
    },
    emptySubtitle : {
        width      : '90%',
        fontSize   : 14,
        lineHeight : 20,
        color      : colors[mode].TEXT_SECONDARY,
        textAlign  : 'center'

    },
    loadingContainer : {
        flex           : 1,
        position       : 'absolute',
        top            : 0,
        left           : 0,
        right          : 0,
        bottom         : 0,
        width          : '100%',
        alignItems     : 'center',
        justifyContent : 'center',
        opacity        : 0.4,
        paddingTop     : 60
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
    emptyContainer : {
        flex           : 1,
        maxWidth       : '100%',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    searchWrapper : {
        width         : '100%',
        flexDirection : 'row',
        alignItems    : 'center',
        marginBottom  : 10
    },
    searchView : {
        flex           : 1,
        height         : 60,
        alignItems     : 'flex-start',
        justifyContent : 'center'
    },
    closeIcon : {
        marginLeft : 10
    },
    draggableWrapper : {
        height   : '100%',
        width    : '100%',
        overflow : 'hidden'
    },
    groupsWrapper : {
        marginTop : 15
    },
    listWithoutRightPadding : {
        paddingLeft : 5,
        marginLeft  : -5,
        marginRight : -16,
        height      : '100%'
    },
    entityRightPadding : {
        marginRight : 16,
        flex        : 1,
        width       : 'auto'
    }
});
