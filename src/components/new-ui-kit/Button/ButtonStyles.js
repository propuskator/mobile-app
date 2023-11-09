import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default (mode) => StyleSheet.create({
    containerStyle : {
        width        : '100%',
        borderRadius : 12
    },
    buttonStyle : {
        borderRadius      : 12,
        backgroundColor   : colors[mode].BUTTON_BG,
        height            : 60,
        paddingVertical   : 16,
        paddingHorizontal : 18
    },
    titleStyle : {
        fontSize      : 16,
        fontWeight    : '700',
        color         : colors[mode].PRIMARY_LABEL,
        paddingTop    : 0,
        paddingBottom : 0
    },
    titleSecondaryStyle : {
        color : colors[mode].SECONDARY_LABEL
    },
    buttonSecondaryStyle : {
        height          : 50,
        padding         : 10,
        backgroundColor : colors[mode].BUTTON_BG_SECONDARY
    },
    buttonClearStyle : {
        backgroundColor : 'transparent'
    },
    buttonDisabled : {
        backgroundColor : colors[mode].BUTTON_BG_DISABLED
    },
    buttonDisabledTitle : {
        color : colors[mode].BUTTON_LABEL_DISABLED
    }
});
