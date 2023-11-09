import { StyleSheet } from 'react-native';

import colors from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    borderedBlock : {
        width        : '100%',
        marginBottom : 8
    },
    container : {
        width           : '100%',
        minHeight       : 130,
        backgroundColor : colors[mode].ITEM_BG
    },
    heading : {
        display       : 'flex',
        flexDirection : 'row',
        height        : 68
    },
    leftPart : {
        flexGrow          : 1,
        flexShrink        : 1,
        alignItems        : 'flex-start',
        justifyContent    : 'center',
        paddingHorizontal : 16

    },
    rightPart : {
        flexGrow       : 0,
        flexShrink     : 0,
        maxWidth       : 108,
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'flex-end',
        paddingRight   : 16
    },
    divider : {
        marginLeft  : 0,
        marginRight : 0,
        width       : '100%'
    },
    statusWrapper : {
        marginBottom : 4
    },
    name : {
        fontSize   : 16,
        fontWeight : '700'
    },
    iconControlWrapper : {
        width          : 40,
        height         : 40,
        borderRadius   : 20,
        // borderWidth    : 1,
        // borderColor    : colors[mode].DIVEDER_COLOR,
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    accessControlWrapper : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : 16,
        paddingTop     : 0
    },
    relayContainer : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'flex-start',
        height         : 60,
        padding        : 8,
        flexDirection  : 'row'
    },
    relayName : {
        flex       : 1,
        fontWeight : '500'
    },
    siriIcon : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        paddingRight   : 12,
        height         : '100%'
    },
    displayedTopics : {
        flex           : 1,
        flexDirection  : 'row',
        justifyContent : 'center'
    },
    displayedTopic : {
        height          : 58,
        paddingVertical : 16,
        paddingTop      : 8,
        display         : 'flex',
        alignItems      : 'center',
        justifyContent  : 'center'
    },
    topicContent : {
        flex           : 1,
        width          : '100%',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    inlintNameInput : {
        paddingHorizontal : 16
    }
});
