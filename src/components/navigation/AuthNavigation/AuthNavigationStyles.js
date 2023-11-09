import { StyleSheet, Platform } from 'react-native';


export default () => StyleSheet.create({
    cameraStatusWrapper : {
        marginRight : 20,
        ...Platform.select({
            ios     : null,
            default : {
                marginVertical   : 3,
                marginHorizontal : 11
            }
        })
    },
    screenOptionsRightContainer : {
        flexDirection : 'row',
        alignItems    : 'center'
    },
    rightHeaderBtn : {
        padding : 15,
        height  : 50
    }
});
