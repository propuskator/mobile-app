import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default (mode) => StyleSheet.create({
    container : {
        justifyContent : 'center',
        alignItems     : 'center'
    },
    outerRing : {
        width          : 21,
        height         : 21,
        borderRadius   : 21 / 2,
        borderWidth    : 2,
        borderColor    : colors.GREY_MEDIUM,
        justifyContent : 'center',
        alignItems     : 'center'
    },
    innerRing : {
        height          : 12,
        width           : 12,
        borderRadius    : 6,
        backgroundColor : colors[mode].PRIMARY
    },
    checked : {
        borderColor : colors[mode].PRIMARY
    }
});
