import { StyleSheet } from 'react-native';
import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        flexDirection   : 'column',
        justifyContent  : 'space-between',
        padding         : 20,
        backgroundColor : colors[mode].BACKGROUND
    },
    btn : {
        marginBottom : 20
    },
    description : {
        color        : colors[mode].TEXT_PRIMARY,
        fontSize     : 16,
        marginBottom : 25
    }
});
