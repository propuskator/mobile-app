import { StyleSheet }    from 'react-native';
import { isAndroid }     from '../../../utils/platform';
import colors            from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        width           : '100%',
        backgroundColor : colors[mode].BACKGROUND
    },
    contentContainer : {
        flex            : 1,
        width           : '100%',
        height          : '100%',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        backgroundColor : colors[mode].BACKGROUND,
        padding         : 20,
        paddingVertical : 1
    },
    content : {
        flexGrow : 1,
        height   : '100%',
        width    : '100%'
    },
    inputsWrapper : {
        flexGrow : 1,
        width    : '100%'
    },
    footer : {
        width          : '100%',
        justifyContent : 'center',
        marginBottom   : isAndroid ? 20 : 15
    },
    stepperContainer : {
        height          : 'auto',
        marginVertical  : 30,
        backgroundColor : colors[mode].BACKGROUND
    },
    headingContainer : {
        paddingHorizontal : 20
    }
});
