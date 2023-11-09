import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container : {
        position : 'relative',
        height   : '100%'
    },
    disabled : {
        opacity : 0.4
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
