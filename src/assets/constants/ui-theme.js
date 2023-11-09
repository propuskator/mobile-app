import { isAndroid } from '../../utils/platform';

import colors    from './colors';

export default mode => ({
    Button : {
        containerStyle : {
            width        : '100%',
            borderRadius : 0
        },
        buttonStyle : {
            borderRadius : 0,
            height       : 60,
            padding      : 18
        },
        titleStyle : {
            fontSize : 16
        }
    },
    Input : {
        containerStyle : {
            paddingHorizontal : 0
        },
        labelStyle : {
            fontWeight : '400',
            fontSize   : 16
        },
        inputStyle : {
            minHeight : 18
        },
        leftIconContainerStyle : {
            height : 24
        },
        rightIconContainerStyle : {
            height : 24
        },
        errorStyle : {
            height     : 17,
            marginLeft : 0
        }
    },
    SearchBar : {
        containerStyle : {
            marginHorizontal : 12
        },
        cancelButtonProps : {
            color : colors[mode].PRIMARY
        },
        cancelButtonStyles : {
            color : colors[mode].TEXT_SECONDARY
        },
        inputContainerStyle : {
            ...(isAndroid && {
                borderRadius : 8
            })
        },
        ...(isAndroid && {
            containerStyle : {
                paddingHorizontal : 20,
                backgroundColor   : colors[mode].BACKGROUND
            },
            inputStyle : {
                height          : 36,
                paddingVertical : 2,
                fontSize        : 16,
                marginLeft      : 0,
                color           : colors[mode].TEXT_SECONDARY
            }
        })
    },
    colors : {
        primary : colors[mode].BUTTON_PRIMARY
        // secondary;
        // grey0;
        // grey1;
        // grey2;
        // grey3;
        // grey4;
        // grey5;
        // greyOutline;
        // searchBg;
        // success;
        // error;
        // warning;
        // divider;
        // platform: {
        //   ios: {
        //     primary;
        //     secondary;
        //     success;
        //     error;
        //     warning;
        //   };
        //   android: {
        //     primary;
        //     secondary;
        //     success;
        //     error;
        //     warning;
        //   };
        // };
    }
});
