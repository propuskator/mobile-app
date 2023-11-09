import React, {
    PureComponent,
    forwardRef,
    createRef
}                                           from 'react';
import PropTypes                            from 'prop-types';
import { Input }                            from 'react-native-elements';
import { View }                             from 'react-native';

import Text                                 from '../Text';
import colors                               from '../../../new-assets/constants/colors';

import { isIOS,
    allowFontScaling as platformAllowFontScaling
}                                          from '../../../utils/platform';
import {
    MAX_SCALE_MULTIPLIER
}                                           from '../../../new-assets/constants/theme';

import styles                               from './InputStyles';

const INPUT_ROW_HEIGHT = 48;

class CustomInput extends PureComponent {
    static propTypes = {
        name : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        onChange                : PropTypes.func,
        forwardedRef            : PropTypes.object,
        containerStyle          : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        onBlur                  : PropTypes.func,
        colorMode               : PropTypes.string.isRequired,
        errorMessage            : PropTypes.string,
        labelStyle              : PropTypes.object,
        rightIcon               : PropTypes.func,
        rightIconContainerStyle : PropTypes.object,
        leftIconContainerStyle  : PropTypes.object,
        errorStyle              : PropTypes.object,
        inputStyle              : PropTypes.object,
        multiline               : PropTypes.bool,
        isInvalid               : PropTypes.bool,
        autoFocus               : PropTypes.bool,
        rows                    : PropTypes.number,  // Number of rows to display when multiline option is set to true.
        label                   : PropTypes.string,
        subLabel                : PropTypes.string,
        inputContainerStyle     : PropTypes.object,
        autoCapitalize          : PropTypes.oneOf([ 'characters', 'words', 'sentences', 'none' ]),
        allowFontScaling        : PropTypes.bool
    }

    static defaultProps = {
        name                    : '',
        label                   : '',
        subLabel                : '',
        errorMessage            : '',
        onChange                : () => {},
        forwardedRef            : undefined,
        containerStyle          : undefined,
        onBlur                  : () => {},
        labelStyle              : void 0,
        inputStyle              : void 0,
        rightIcon               : void 0,
        rightIconContainerStyle : void 0,
        leftIconContainerStyle  : void 0,
        errorStyle              : void 0,
        multiline               : false,
        isInvalid               : false,
        autoFocus               : false,
        rows                    : 3,
        inputContainerStyle     : void 0,
        autoCapitalize          : 'sentences',
        allowFontScaling        : void 0
    }

    constructor(props) {
        super(props);

        this.state = {
            isFocused : false
        };

        this.inputRef = createRef();
    }

    componentDidMount() {
        const { autoFocus } = this.props;

        if (autoFocus) {
            setTimeout(() => {
                if (this.inputRef.current) {
                    this.inputRef.current?.focus();
                }
            }, isIOS ? 0 : 100);
        }
    }

    handleChange = value => {
        const { name, onChange } = this.props;

        onChange(name, value);
    }

    handleFocus = () => this.setState({ isFocused: true });

    handleBlur = () => {
        const { onBlur } = this.props;

        onBlur();

        this.setState({ isFocused: false });
    }

    setRefs = node => {
        const { forwardedRef } = this.props;

        this.inputRef.current = node;
        if (forwardedRef && 'current' in forwardedRef) forwardedRef.current = node;
    }

    render() {
        const {
            containerStyle,
            inputStyle,
            labelStyle,
            rightIcon,
            rightIconContainerStyle,
            leftIconContainerStyle,
            errorStyle,
            colorMode,
            multiline,
            rows,
            // eslint-disable-next-line no-unused-vars
            onChange, // dont delete this line!
            // eslint-disable-next-line no-unused-vars
            autoFocus, // dont delete this line!
            subLabel,
            inputContainerStyle,
            label,
            isInvalid,
            errorMessage,
            autoCapitalize,
            allowFontScaling:allowFontScalingFromProps,
            ...rest
        } = this.props;
        const { isFocused } = this.state;
        const style = styles(colorMode);
        const inputHeight = multiline ? rows * INPUT_ROW_HEIGHT : INPUT_ROW_HEIGHT;
        const inputHeightStyles = { paddingTop: multiline ? 8 : null, height: inputHeight };
        const labelStyles = [
            style.labelStyle,
            labelStyle,
            isFocused && style.labelStyleFocused
        ];
        const labelComponent =
            (<View style={style.labelWrapper} >
                <Text
                    style={labelStyles} >
                    {label}
                </Text>

                <Text variant='caption2' color='grey'>
                    {subLabel}
                </Text>
            </View>);

        const iconDefaultProps = {
            hitSlop        : { top: 10, left: 10, right: 10, bottom: 10 },
            containerStyle : {
                overflow : 'visible'
            }
        };
        const allowFontScaling = [ true, false ]?.includes(allowFontScalingFromProps)
            ? allowFontScalingFromProps
            : platformAllowFontScaling;


        return (
            <Input
                {...rest}
                inputStyle              = {[ style.inputStyle, inputHeightStyles, inputStyle ]}
                containerStyle          = {[ style.container, containerStyle ]}
                labelStyle              = {[
                    style.labelStyle,
                    labelStyle,
                    isFocused && style.labelStyleFocused
                ]}
                rightIcon               = {{ ...iconDefaultProps, ...rightIcon }}
                leftIconContainerStyle  = {[ style.leftIconContainerStyle, leftIconContainerStyle ]}
                rightIconContainerStyle = {[ style.rightIconContainerStyle, rightIconContainerStyle ]}
                errorStyle              = {[ style.errorStyle, errorStyle ]}
                inputContainerStyle     = {[
                    style.inputContainerStyle,
                    isFocused && style.inputContainerStyleFocused,
                    { height: inputHeight },
                    inputContainerStyle,
                    (errorMessage || isInvalid) ? { borderColor: colors.RED_MAIN } : {}
                ]}
                labelProps              = {{
                    allowFontScaling,
                    maxFontSizeMultiplier : MAX_SCALE_MULTIPLIER
                }}
                errorMessage            = {errorMessage}
                allowFontScaling        = {allowFontScaling}
                maxFontSizeMultiplier   = {MAX_SCALE_MULTIPLIER}
                label                   = {labelComponent}
                ref                     = {this.setRefs}
                onFocus                 = {this.handleFocus}
                onBlur                  = {this.handleBlur}
                onChangeText            = {this.handleChange}
                placeholderTextColor    = {colors.GREY_MEDIUM}
                keyboardAppearance      = {colorMode}
                multiline               = {multiline}
                textAlignVertical       = {'top'}
                autoCapitalize          = {autoCapitalize}
                autoComplete            = 'off'
            />
        );
    }
}


// eslint-disable-next-line react/no-multi-comp
export default forwardRef((props, ref) => <CustomInput {...props} forwardedRef={ref} />);
