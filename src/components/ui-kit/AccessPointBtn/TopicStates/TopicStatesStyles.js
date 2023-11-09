import { StyleSheet } from 'react-native';

import colors         from '../../../../assets/constants/colors';

// eslint-disable-next-line func-style
export const CONTAINER_COLORS = {
    light : '#F9F9F9',
    dark  : '#4b5161'
};

export default mode => StyleSheet.create({
    lockIcons : {
        flexDirection   : 'column',
        width           : 18,
        backgroundColor : CONTAINER_COLORS[mode],
        paddingVertical : 3,
        borderRadius    : 10,
        marginLeft      : 5
    },
    lockIconContainer : {
        justifyContent : 'center',
        alignItems     : 'center'
    },
    lockIconText : {
        fontSize  : 8,
        marginTop : 1,
        color     : colors[mode].TEXT_PRIMARY
    },
    divider : {
        height           : 1,
        backgroundColor  : colors[mode].TEXT_PRIMARY,
        opacity          : 0.05,
        marginVertical   : 3,
        marginHorizontal : 1.5
    }
});

