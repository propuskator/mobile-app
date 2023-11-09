import { StyleSheet } from 'react-native';

import colors         from '../../../assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        display         : 'flex',
        flexDirection   : 'row',
        alignItems      : 'center',
        justifyContent  : 'center',
        backgroundColor : 'transparent'
    },
    title : {
        fontWeight : 'bold',
        fontSize   : 16,
        color      : colors[mode].TEXT_PRIMARY
    },
    language : {
        fontSize    : 18,
        marginRight : 10,
        color       : colors[mode].TEXT_SECONDARY
    },
    languageWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    globalIcon : {
        marginRight : 10
    }
});
