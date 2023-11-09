import { StyleSheet } from 'react-native';

import { wh }         from '../../../utils/platform';

export default StyleSheet.create({
    icon : {
        maxHeight : wh * 0.1
    },
    logoWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        marginTop      : 50,
        marginBottom   : 13
    }
});
