import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'center',
        paddingTop      : 60,
        backgroundColor : colors[mode].BACKGROUND
    },
    info : {
        color       : colors[mode].TEXT_PRIMARY,
        textAlign   : 'center',
        paddingLeft : 10,
        paddingTop  : 5,
        fontSize    : 16
    },
    logo : {
        top          : -70,
        marginBottom : 70,
        marginTop    : 10
    }
});
