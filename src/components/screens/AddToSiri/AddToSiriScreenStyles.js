import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';

export default mode => StyleSheet.create({
    container : {
        flex            : 1,
        flexDirection   : 'column',
        justifyContent  : 'space-between',
        padding         : 20,
        backgroundColor : colors[mode].BACKGROUND_SECONDARY
    },
    pickerContainer : {
        position      : 'relative',
        flex          : 1,
        paddingBottom : 20
    },
    btn : {
        marginBottom : 20
    },
    modal : {
        backgroundColor : colors[mode].BACKGROUND_SECONDARY,
        padding         : 20,
        flex            : 1
    },
    block : {
        height        : 160,
        paddingBottom : 30
    },
    title : {
        fontWeight    : 'bold',
        color         : colors[mode].TEXT_PRIMARY,
        fontSize      : 16,
        paddingBottom : 5
    },
    subTitle : {
        fontSize     : 16,
        color        : colors[mode].TEXT_SECONDARY,
        marginBottom : 24
    }
});
