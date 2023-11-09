import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default (mode) => StyleSheet.create({
    container : {
        flex            : 1,
        flexShrink      : 0,
        height          : 1,
        minHeight       : 1,
        maxHeight       : 1,
        backgroundColor : colors[mode].DIVEDER_COLOR,
        opacity         : 0.5,
        marginLeft      : 15,
        marginRight     : 15,
        marginTop       : -1
    },
    dark : {
        backgroundColor : colors.GREY_MEDIUM,
        opacity         : 0.5
    }
});
