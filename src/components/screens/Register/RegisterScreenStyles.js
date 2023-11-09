import { StyleSheet } from 'react-native';
import { wh, mediumHeight }         from '../../../utils/platform';
import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    pressableWrapper : {
        flex  : 1,
        width : '100%'
    },
    mainWrapper : {
        flex  : 1,
        width : '100%'
    },
    maincontainer : {
        backgroundColor : colors[mode].BACKGROUND
    },
    container : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'flex-end',
        backgroundColor : colors[mode].BACKGROUND,
        padding         : 20,
        paddingTop      : 5,
        paddingBottom   : 0
    },
    wrapper : {
        flex           : 1,
        width          : '100%',
        alignItems     : 'center',
        minHeight      : 300,
        justifyContent : 'space-evenly'
    },
    scrollStyle : {
        width     : '100%',
        minHeight : '100%'
    },
    inputsWrapper : {
        width : '100%'
    },
    scrollContentStyle : {
        flexGrow       : 1,
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : 20
    },
    icon : {
        maxHeight : wh * 0.1
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
        fontWeight : '400',
        height     : 15

    },
    registerContainer : {
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : colors[mode].BACKGROUND,
        height          : mediumHeight ? 70 : 78
    },
    registerBtnContainer : {
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : 15,
        paddingTop     : 5
    },
    buttonWrapper : {
        paddingHorizontal : 20,
        paddingBottom     : 20,
        backgroundColor   : colors[mode].BACKGROUND
    },
    descriptionWrapper : {
        width           : '100%',
        backgroundColor : colors[mode].BACKGROUND,

        marginBottom : 10
    },
    description : {
        color    : colors[mode].TEXT_SECONDARY,
        fontSize : 12
    },
    registerTitle : {
        color        : colors[mode].PRIMARY,
        fontSize     : 15,
        fontWeight   : '600',
        marginBottom : 5
    },
    registerDescription : {
        color        : colors[mode].TEXT_PRIMARY,
        fontSize     : 12,
        marginBottom : mediumHeight ? 0 : 8
    },
    checkboxWrapper : {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        alignSelf      : 'flex-end'
    },
    checkboxTitleContainer : {
        flex : 1
    },
    checkboxTitle : {
        fontSize : 12,
        color    : colors[mode].TEXT_PRIMARY || '#D1D1D1'
    },
    checkboxLink : {
        color              : colors[mode].PRIMARY,
        textDecorationLine : 'underline',
        fontSize           : 12
    },
    requestLink : {
        color         : colors[mode].PRIMARY,
        textAlign     : 'center',
        paddingBottom : 30,
        fontSize      : 15,
        fontWeight    : '600'
    },
    checkboxErrorText : {
        width     : '100%',
        color     : colors[mode].ERROR,
        minHeight : 33,
        fontSize  : 12,
        marginTop : 5
    },
    logoWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        marginTop      : 60,
        marginBottom   : 13
    },
    spinner : {
        flex            : 1,
        backgroundColor : colors[mode].BACKGROUND,
        alignItems      : 'center',
        justifyContent  : 'center'
    },
    infoTip : {
        marginRight : -8
    }
});
