import { StyleSheet } from 'react-native';

import { mediumHeight, smallWidth } from '../../../utils/platform';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    pressableWrapper : {
        flex  : 1,
        width : '100%'
    },
    wrapper : {
        flex           : 1,
        width          : '100%',
        alignItems     : 'center',
        justifyContent : 'flex-start',
        minHeight      : 245,
        paddingTop     : smallWidth ? 10 : 20
    },
    inputsContainerWrapper : {
        width : '100%'
    },
    contentContainer : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'flex-start',
        justifyContent  : 'flex-end',
        backgroundColor : colors[mode].BACKGROUND,
        padding         : 20,
        paddingVertical : 5
    },
    container : {
        flex            : 1,
        width           : '100%',
        backgroundColor : colors[mode].BACKGROUND
    },
    focused : {
        justifyContent : 'flex-start'
    },
    scrollStyle : {
        width : '100%'
    },
    inputsWrapper : {
        width : '100%'
    },
    title : {
        fontSize   : 35,
        fontWeight : '600',
        color      : colors[mode].TEXT_PRIMARY,
        marginLeft : 20
    },
    changeSettings : {
        width          : '100%',
        flexDirection  : 'row',
        alignItems     : 'center',
        alignSelf      : 'flex-start',
        justifyContent : 'flex-start'
    },
    changeSettingsWrapper : {
        width         : '100%',
        flexDirection : 'row',
        alignSelf     : 'flex-start',
        paddingTop    : 10
    },
    changeSettingsTitle : {
        color      : colors[mode].PRIMARY,
        fontSize   : 12,
        height     : 15,
        fontWeight : '400'
    },
    registerContainer : {
        alignItems      : 'center',
        justifyContent  : 'center',
        color           : colors[mode].BUTTON_PRIMARY,
        backgroundColor : colors[mode].BACKGROUND,
        height          : mediumHeight ? 70 : 78
    },
    registerBtnContainer : {
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : 15
    },
    buttonWrapper : {
        paddingHorizontal : 20,
        paddingBottom     : 20,
        paddingVertical   : 5,
        backgroundColor   : colors[mode].BACKGROUND
    },
    registerTitle : {
        color        : colors[mode].PRIMARY,
        fontSize     : 15,
        fontWeight   : '600',
        marginBottom : 15
    },
    registerDescription : {
        color        : colors[mode].TEXT_PRIMARY,
        fontSize     : 12,
        marginBottom : mediumHeight ? 0 : 8
    },
    restorePassContainer : {
        alignItems : 'flex-end',
        marginTop  : -12
    },
    restorePassButton : {
    },
    restorePassText : {
        color    : colors[mode].PRIMARY,
        fontSize : 12
    },
    infoTip : {
        marginRight : -8
    },
    footer : {
        backgroundColor : colors[mode].BACKGROUND
    },
    biometricBlock : {
        display        : 'flex',
        alignItems     : 'center',
        marginVertical : 22
    },
    biometricTitle : {
        color    : colors[mode].PRIMARY,
        fontSize : 13
    },
    biometricIcon : {
        marginBottom : 14
    }
});
