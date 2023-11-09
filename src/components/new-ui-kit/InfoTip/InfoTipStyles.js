import { StyleSheet }  from 'react-native';
import colors          from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    tip : {
        width           : '80%',
        backgroundColor : colors[mode].BACKGROUND
    },
    tipText : {
        color    : colors[mode].TEXT_PRIMARY,
        fontSize : 16
    },
    iconStyle : {
        margin : 5
    }
});
