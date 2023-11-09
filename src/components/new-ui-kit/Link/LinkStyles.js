import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default (mode) => StyleSheet.create({
    container : {
        fontSize : 16
    },
    withUnderline : {
        textDecorationLine  : 'underline',
        textDecorationColor : colors[mode].PRIMARY
    }
});
