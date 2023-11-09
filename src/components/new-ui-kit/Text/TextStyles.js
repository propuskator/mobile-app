import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    headline1 : {
        fontWeight : '700',
        fontSize   : 28
    },
    headline2 : {
        fontWeight : '700',
        fontSize   : 20
    },
    headline3 : {
        fontWeight : '500',
        fontSize   : 18
    },
    headline4 : {
        fontWeight : '500',
        fontSize   : 14
    },
    body1 : {
        fontSize : 16
    },
    body2 : {
        fontSize : 14
    },
    caption1 : {
        fontSize   : 14,
        color      : colors[mode]?.TEXT_SECONDARY,
        fontWeight : '400',
        lineHeight : 20
    },
    caption2 : {
        fontSize   : 12,
        lineHeight : 14
    },
    black : {
        color : colors[mode]?.TEXT_PRIMARY
    },
    grey : {
        color : colors[mode]?.TEXT_SECONDARY
    },
    greyMedium : {
        color : colors?.GREY_MEDIUM
    },
    greyLight : {
        color : colors?.GREY_LIGHT
    },
    greyStrong : {
        color : colors?.GREY_STRONG
    },
    salad : {
        color : colors.SALAD
    },
    primary : {
        color : colors[mode]?.PRIMARY
    },
    greenDark : {
        color : colors[mode].SECONDARY_LABEL
    },
    red : {
        color : colors.ERROR_LIGHT
    }
});
