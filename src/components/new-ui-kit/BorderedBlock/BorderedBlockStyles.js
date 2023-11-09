import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default (mode) => StyleSheet.create({
    container : {
        overflow        : 'hidden',
        borderRadius    : 12,
        backgroundColor : colors[mode].BACKGROUND
    },
    secondary : {
        backgroundColor : colors[mode].SECONDARY_BACKGROUND
    },
    withShadow : {
        shadowColor   : '#000',
        shadowOffset  : { width: 0, height: 1 },
        shadowOpacity : 0.1,
        shadowRadius  : 4
    },
    bordered : {
        borderColor : mode === 'light' ? colors.GREY_LIGHT : 'transparent',
        borderWidth : 1
    },
    title : {
        marginBottom : 8,
        color        : mode === 'dark' ? colors.GREY_LIGHTER : colors[mode]?.TEXT_SECONDARY
    }
});
