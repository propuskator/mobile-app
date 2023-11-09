import { StyleSheet } from 'react-native';
import { isAndroid } from '../../../utils/platform';

import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    containerStyle : {
        backgroundColor  : 'transparent', // colors[mode].BACKGROUND,
        marginHorizontal : 0
    },
    inputContainerStyle : {
        backgroundColor : colors[mode].SEARCH_BG,
        height          : 36
    },
    inputStyle : {
        color   : colors[mode].SEARCH_BAR,
        opacity : mode === 'dark' ? 0.8 : 0.5,
        height  : 36
    },
    cancelButtonProps : {
        color : colors[mode].SEARCH_BAR
    },
    cancelButtonStyles : {
        color : colors[mode].SEARCH_BAR
    },
    ...(isAndroid && {
        inputContainerStyle : {
            backgroundColor : colors[mode].SEARCH_BG,
            height          : 36,
            borderRadius    : 8
        },
        containerStyle : {
            backgroundColor : 'transparent' // || colors[mode].BACKGROUND
        },
        inputStyle : {
            height          : 36,
            paddingVertical : 2,
            fontSize        : 16,
            marginLeft      : 0,
            color           : colors[mode].SEARCH_BAR
        }
    })
});
