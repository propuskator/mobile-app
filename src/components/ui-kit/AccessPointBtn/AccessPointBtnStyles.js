import { StyleSheet } from 'react-native';

import colors from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    mainContainer : {
        marginBottom : 15
    },
    container : {
        height          : 72,
        width           : '100%',
        backgroundColor : colors[mode].ITEM_BG,
        borderRadius    : 15,
        paddingLeft     : 16,
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        zIndex          : 2
    },
    withRelays : {
        marginBottom : 0
    },
    relayContainer : {
        marginBottom : 0,
        zIndex       : 1
    },
    siriIcon : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        paddingRight   : 5,
        height         : '100%'
    },
    buttonWrapper : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        paddingRight   : 10,
        paddingLeft    : 5,
        height         : '100%'
    },
    nameWrapper : {
        flex            : 1,
        flexDirection   : 'column',
        alignItems      : 'center',
        justifyContent  : 'center',
        paddingVertical : 12,
        height          : '100%'
    },
    firstBlock : {
        width         : '100%',
        flexDirection : 'row',
        alignItems    : 'center'
    },
    secondBlock : {
        width         : '100%',
        flexDirection : 'row',
        alignItems    : 'center',
        marginTop     : 5
    },
    name : {
        flex       : 1,
        color      : colors[mode].TEXT_PRIMARY,
        fontSize   : 16,
        fontWeight : 'bold'
    },
    phone : {
        flex     : 1,
        color    : colors[mode].GRAY,
        fontSize : 13
    },
    phoneIcon : {
        marginRight : 5
    },
    dragIcon : {
        marginRight : 10
    },
    editIcon : {
        marginRight : 10,
        maxHeight   : 15
    }
});

