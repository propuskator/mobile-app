import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        paddingHorizontal : 16
    },
    contentContainer : {
        alignItems      : 'center',
        justifyContent  : 'space-between',
        paddingVertical : 16
    },
    blockContainer : {
        width : '100%'
    },
    screenTitle : {
        fontWeight   : '600',
        textAlign    : 'center',
        marginTop    : 10,
        marginBottom : 27
    },
    accountTitle : {
        fontSize : 12,
        color    : colors[mode].GREY_STRONG
    },
    accountSubtitle : {
        fontSize   : 18,
        fontWeight : '500',
        color      : colors[mode].TEXT_PRIMARY,
        marginTop  : 4
    },
    borderedBlock : {
        marginBottom : 24
    },
    blockWrapper : {
        width        : '100%',
        marginBottom : 8
    },
    privacyContainer : {
        display        : 'flex',
        flexDirection  : 'row',
        flexWrap       : 'wrap',
        justifyContent : 'center',
        textAlign      : 'center'
    },
    link : {
        fontSize           : 14,
        color              : colors[mode].PRIMARY,
        textDecorationLine : 'underline'
    },
    linkConjunction : {
        fontSize : 14,
        color    : colors[mode].TEXT_SECONDARY
    },
    logoutBtnTitle : {
        color : colors[mode].ERROR
    }
});
