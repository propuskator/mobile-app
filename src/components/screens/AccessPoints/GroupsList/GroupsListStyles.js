import { StyleSheet } from 'react-native';

// import colors         from '../../../../assets/constants/colors';


export default (/* mode */) => StyleSheet.create({
    container : {
        display       : 'flex',
        flexDirection : 'row',
        marginTop     : 0,
        minWidth      : '100%',
        paddingRight  : 12
    },
    withPadding : {
        marginLeft : 10
    },
    group : {
        width        : 70,
        marginLeft   : 8,
        marginRight  : 8,
        marginTop    : 6,
        marginBottom : 5,
        minWidth     : 70
    }
});
