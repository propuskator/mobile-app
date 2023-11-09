import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    socialMedia : {
        height          : 65,
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'space-evenly',
        minWidth        : 190,
        alignSelf       : 'center',
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 10
    }
});
