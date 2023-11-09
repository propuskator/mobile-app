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
        fontWeight   : 'bold',
        fontSize     : 16,
        marginBottom : 4,
        color        : colors[mode].TEXT_PRIMARY
    },
    subtitle : {
        fontSize : 14,
        color    : colors[mode].TEXT_SECONDARY
    }
});
