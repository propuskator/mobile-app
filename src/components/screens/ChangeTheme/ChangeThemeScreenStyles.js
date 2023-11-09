import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    contentContainer : {
        flex            : 1,
        width           : '100%',
        justifyContent  : 'flex-start',
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 16
    },
    selectedTitle : {
        color : colors[mode].PRIMARY
    },
    title : {
        fontWeight : '500',
        fontSize   : 16,
        color      : colors[mode].TEXT_PRIMARY
    }
});
