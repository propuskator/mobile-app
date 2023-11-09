import { StyleSheet } from 'react-native';
// import colors         from '../../../new-assets/constants/colors';

export default (/* mode */) => StyleSheet.create({
    cameraWrapper : {
        position        : 'relative',
        height          : 220,
        width           : '100%',
        backgroundColor : '#1B312F'
    },
    fadeWrapper : {
        position       : 'absolute',
        left           : 0,
        top            : 0,
        width          : '100%',
        height         : '100%',
        justifyContent : 'center',
        alignItems     : 'center'
    },
    controlsWrapper : {
        position          : 'absolute',
        bottom            : 5,
        width             : '100%',
        justifyContent    : 'center',
        display           : 'flex',
        flexDirection     : 'row',
        paddingHorizontal : 40
    },
    errorMessageWrapper : {
        display        : 'flex',
        flexDirection  : 'column',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    firstMessagePart : {
        display        : 'flex',
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center'
    },
    cameraPreview : {
        position : 'absolute',
        top      : 0,
        left     : 0,
        width    : '100%',
        height   : '100%'
    },
    cameraButton : {
        marginLeft : 25
    },
    fullscreenButton : {
        marginLeft : 25
    }
});
