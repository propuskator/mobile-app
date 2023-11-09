import { StyleSheet } from 'react-native';

import colors from '../../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        backgroundColor : colors[mode].BACKGROUND,
        height          : '100%'
    },
    contentContainer : {
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 20,
        paddingTop      : 0,
        flex            : 1,
        justifyContent  : 'space-between',
        alignItems      : 'center'
    },
    description : {
        fontSize : 15,
        width    : '100%'
    }
});
