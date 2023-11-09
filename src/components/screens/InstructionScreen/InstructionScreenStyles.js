import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        backgroundColor : colors[mode].BACKGROUND_SECONDARY
    },
    contentContainer : {
        minHeight  : '100%',
        padding    : 20,
        alignItems : 'center'
    },
    header : {
        flexDirection : 'row',
        alignItems    : 'center'
    },
    headerTitle : {
        color      : colors[mode].TEXT_PRIMARY,
        marginLeft : 10,
        fontWeight : 'bold'
    },
    title : {
        color        : colors[mode].TEXT_PRIMARY,
        fontWeight   : '700',
        lineHeight   : 24,
        width        : '100%',
        marginBottom : 15
    },
    listItem : {
        flexDirection : 'row',
        marginBottom  : 15,
        maxWidth      : '100%',
        width         : '100%'
    },
    listNumber : {
        color       : colors[mode].TEXT_PRIMARY,
        fontWeight  : '700',
        lineHeight  : 24,
        marginRight : 15
    },
    listText : {
        color      : colors[mode].TEXT_PRIMARY,
        lineHeight : 24,
        width      : '95%'
    },
    imageWrapper : {
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    image : {
        position     : 'absolute',
        top          : 0,
        left         : 0,
        marginBottom : 20
    }
});
