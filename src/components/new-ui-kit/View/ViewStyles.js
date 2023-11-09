import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    style : {
        color : colors[mode].BACKGROUND
    }
});
