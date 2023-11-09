import { StyleSheet } from 'react-native';

export default () => StyleSheet.create({
    container : {
        paddingBottom     : 35,
        paddingHorizontal : 16
    },
    warningText : {
        marginBottom : 5
    },
    actionContainer : {
        flexDirection : 'row',
        alignItems    : 'center',
        minHeight     : 56
    },
    actionText : {
        marginLeft : 16
    }
});
