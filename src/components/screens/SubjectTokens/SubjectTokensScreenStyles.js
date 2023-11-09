import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';
import { isIOS }      from '../../../utils/platform';

export default mode => StyleSheet.create({
    container : {
        flex              : 1,
        width             : '100%',
        paddingHorizontal : 16,
        backgroundColor   : colors[mode].BACKGROUND
    },
    contentContainer : {
        height : '100%'
    },
    tokenBlock : {
        marginBottom : 8,
        borderRadius : 12
    },
    searchWrapper : {
        marginLeft  : isIOS ? -6 : 0,
        marginRight : isIOS ? -6 : 0
    },
    search : {
        width : '100%'
    },
    borderedBlock : {
        marginTop         : 12,
        paddingHorizontal : 0,
        width             : '100%'
    },
    customBlock : {
        display       : 'flex',
        flexDirection : 'row',
        width         : '100%',
        paddingTop    : 12,
        paddingBottom : 12
    },
    leftPart : {
        flexGrow          : 1,
        flexShrink        : 1,
        flexDirection     : 'row',
        alignItems        : 'center',
        justifyContent    : 'flex-start',
        paddingHorizontal : 13

    },
    leftPartIcon : {
        width          : 33,
        flexShrink     : 0,
        flexGrow       : 0,
        alignItems     : 'flex-start',
        justifyContent : 'center'
    },
    tokenIcon : {
        marginRight : 13
    },
    tokenName : {
        fontSize   : 16,
        fontWeight : '600'
    },
    rightPart : {
        flexGrow       : 0,
        flexShrink     : 0,
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        width          : 50,
        padding        : 16
    },
    loaderWrapper : {
        flex           : 1,
        justifyContent : 'center',
        alignItems     : 'center'
    },
    emptyContainer : {
        flex              : 1,
        alignItems        : 'center',
        justifyContent    : 'center',
        paddingHorizontal : 20,
        minHeight         : 400
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
    scroll : {
        minHeight : '100%'
    },
    headerOptionsIcon : {
        paddingRight : 16
    },
    addTagControlWrapper : {
        marginTop : 30,
        width     : '100%'
    },
    listWithoutRightPadding : {
        marginRight : -16,
        height      : '100%'
    },
    entityRightPadding : {
        marginRight : 16
    }
});
