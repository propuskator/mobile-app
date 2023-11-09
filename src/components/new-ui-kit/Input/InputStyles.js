import { StyleSheet } from 'react-native';
import colors         from '../../../new-assets/constants/colors';


export default mode => StyleSheet.create({
    container : {
        paddingHorizontal : 0
    },
    errorStyle : {
        height     : 'auto',
        minHeight  : 15,
        margin     : 3,
        marginLeft : 0,
        color      : colors.RED_MAIN
    },
    labelStyle : {
        fontWeight : '500',
        fontSize   : 14,
        color      : colors[mode].TEXT_PRIMARY
    },
    inputStyle : {
        color           : colors[mode].TEXT_PRIMARY,
        paddingVertical : 10
    },
    inputContainerStyle : {
        borderColor       : colors[mode].INPUT_COLOR,
        backgroundColor   : colors[mode].WHITE_MAIN,
        borderWidth       : 1,
        borderRadius      : 8,
        paddingHorizontal : 12,
        paddingVertical   : 0,
        marginTop         : 5
    },
    leftIconContainerStyle : {
        paddingRight : 12,
        alignSelf    : 'center'
    },
    rightIconContainerStyle : {
        paddingRight : 2,
        paddingLeft  : 10
    },
    inputContainerStyleFocused : {
        borderColor : colors[mode].FOCUSED_INPUT_COLOR
    },
    labelStyleFocused : {
        color : colors[mode].FOCUSED_INPUT_COLOR
    },
    labelWrapper : {
        display        : 'flex',
        flexDirection  : 'row',
        justifyContent : 'space-between'
    }
});
