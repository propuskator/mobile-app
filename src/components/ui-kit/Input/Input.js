import React, { PureComponent, forwardRef } from 'react';
import PropTypes                            from 'prop-types';
import { Input }                            from 'react-native-elements';

import colors                               from '../../../assets/constants/colors';

import style                                from './InputStyles';

class CustomInput extends PureComponent {
    static propTypes = {
        name           : PropTypes.string,
        onChange       : PropTypes.func,
        onFocus        : PropTypes.func,
        forwardedRef   : PropTypes.object,
        containerStyle : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        colorMode      : PropTypes.string
    }

    static defaultProps = {
        name           : '',
        onChange       : () => {},
        onFocus        : () => {},
        forwardedRef   : undefined,
        containerStyle : undefined,
        colorMode      : 'light'
    }

    state = {
        isFocused : false
    }

    handleChange = value => {
        const { name, onChange } = this.props;

        onChange(name, value);
    }

    handleFocus = () => {
        const { onFocus } = this.props;

        this.setState({ isFocused: true });
        if (onFocus) onFocus();
    }

    handleBlur = () => this.setState({ isFocused: false })

    render() {
        // eslint-disable-next-line no-unused-vars
        const { onChange, containerStyle, forwardedRef, colorMode, ...rest } = this.props;
        const { isFocused } = this.state;

        const styles = style(colorMode);

        return (
            <Input
                autoCapitalize          = 'none'
                {...rest}
                ref                     = {forwardedRef}
                onFocus                 = {this.handleFocus}
                onBlur                  = {this.handleBlur}
                labelStyle              = {colorMode === 'dark' ? { color: colors[colorMode].TEXT_SECONDARY } : {}}
                containerStyle          = {[ styles.container, containerStyle ]}
                onChangeText            = {this.handleChange}
                placeholderTextColor    = {colors[colorMode].TEXT_SECONDARY}
                leftIconContainerStyle  = {styles.icon}
                rightIconContainerStyle = {styles.righIcon}
                inputStyle              = {styles.input}
                errorStyle              = {styles.error}
                {...(isFocused && {
                    inputContainerStyle : { borderBottomColor: colors[colorMode].FOCUSED_INPUT_COLOR },
                    labelStyle          : { color: colors[colorMode].FOCUSED_INPUT_COLOR }
                })}
            />
        );
    }
}

// eslint-disable-next-line react/no-multi-comp
export default forwardRef((props, ref) => <CustomInput {...props} forwardedRef={ref} />);
