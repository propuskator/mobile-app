import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flexDirection   : 'row',
        width           : '100%',
        backgroundColor : mode === 'light' ? colors[mode].GREY_LIGHT : colors[mode].GREY_LIGHTER,
        padding         : 10,
        paddingLeft     : 0,
        borderRadius    : 8
    },
    textWrapper : {
        flex : 1
    },
    text : {
        fontSize : 14,
        width    : '100%'
    },
    iconWrapper : {
        width      : 45,
        flex       : 0,
        paddingTop : 3,
        alignItems : 'center'
    }
});
