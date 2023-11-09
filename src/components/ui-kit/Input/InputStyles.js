import { StyleSheet }  from 'react-native';
import colors          from '../../../assets/constants/colors';
import { smallWidth }  from '../../../utils/platform';


export default mode => StyleSheet.create({
    container : {
        paddingHorizontal : 0
    },
    input : {
        minHeight       : smallWidth ? 25 : 35,
        paddingVertical : 0,
        color           : colors[mode].TEXT_PRIMARY
    },
    icon : {
        marginVertical : 2
    },
    righIcon : {
        marginVertical    : 2,
        paddingHorizontal : 7
    },
    error : {
        height    : 'auto',
        minHeight : 15,
        margin    : 3,
        color     : colors[mode].ERROR
    }
});
