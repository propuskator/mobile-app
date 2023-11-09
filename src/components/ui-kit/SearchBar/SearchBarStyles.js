import { StyleSheet } from 'react-native';

import {  isIOS }     from '../../../utils/platform';
import colors         from '../../../assets/constants/colors';

export default mode => StyleSheet.create({
    containerStyle : {
        backgroundColor   : colors[mode].BACKGROUND,
        marginTop         : 20,
        paddingBottom     : 0,
        paddingTop        : 0,
        paddingHorizontal : 0,
        marginBottom      : 0,
        marginHorizontal  : isIOS ? 0 : 10
    },
    inputContainerStyle : {
        backgroundColor : colors[mode].SEARCH_BG
    },
    inputStyle : {
        color   : colors[mode].TEXT_PRIMARY,
        opacity : mode === 'dark' ? 0.8 : 0.5
    }
});
