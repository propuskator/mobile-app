import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    state : {
        display          : 'flex',
        justifyContent   : 'flex-end',
        alignItems       : 'center',
        flexDirection    : 'row',
        marginHorizontal : 10,
        marginVertical   : 5
    },
    label : {
        textTransform : 'capitalize'
    },
    indicator : {
        width           : 6,
        height          : 6,
        borderRadius    : 50,
        margin          : 3,
        backgroundColor : colors[mode].INIT_STATUS_COLOR
    },
    small : {
        width  : 6,
        height : 6
    },
    big : {
        width       : 10,
        height      : 10,
        marginRight : 10
    }
});
