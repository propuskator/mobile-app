import { StyleSheet } from 'react-native';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        width           : '100%',
        backgroundColor : colors[mode].BACKGROUND
    },
    contentContainer : {
        flex            : 1,
        maxWidth        : '100%',
        width           : '100%',
        alignItems      : 'center',
        justifyContent  : 'space-between',
        backgroundColor : colors[mode].BACKGROUND,
        paddingVertical : 5
    },
    blocksContainer : {
        width : '100%'
    },
    deleteBtnTitle : {
        color : colors.RED_MAIN
    },
    footer : {
        width             : '100%',
        paddingHorizontal : 16
    }
});
