import { StyleSheet } from 'react-native';
import { isAndroid } from '../../../utils/platform';

export default StyleSheet.create({
    container : {
        position       : 'relative',
        justifyContent : 'flex-end',
        alignSelf      : 'flex-end'
    },
    disabled : {
        opacity : isAndroid ? 0.8 : 0.4
    },
    spinner : {
        position : 'absolute',
        zIndex   : 1,
        left     : 0,
        top      : 0
    },
    checked : {
        right : 0,
        left  : 'auto'
    }
});
