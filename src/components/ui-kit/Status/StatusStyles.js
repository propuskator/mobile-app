import { StyleSheet } from 'react-native';
import colors         from '../../../assets/constants/colors';


export default mode => StyleSheet.create({
    state : {
        display        : 'flex',
        justifyContent : 'flex-end',
        alignItems     : 'center',
        flexDirection  : 'row',
        marginRight    : 10,
        marginVertical : 5
    },

    indicator : {
        width           : 8,
        height          : 8,
        borderRadius    : 50,
        backgroundColor : colors[mode].INIT_STATUS_COLOR
    },
    small : {
        width  : 8,
        height : 8
    },
    big : {
        width  : 10,
        height : 10
    },
    green : {
        backgroundColor : colors[mode].ACTIVE_STATUS_COLOR
    },
    yellow : {
        backgroundColor : colors[mode].INACTIVE_STATUS_COLOR
    },
    red : {
        backgroundColor : colors[mode].DISCONECTED_STATUS_COLOR
    }
});
