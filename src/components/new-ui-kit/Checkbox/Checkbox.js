/* eslint-disable react/jsx-handler-names */
import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import CheckBox                    from '@react-native-community/checkbox';
import colors                      from '../../../new-assets/constants/colors';

import style                       from './CheckboxStyles';

class CustomCheckbox extends PureComponent {
    static propTypes = {
        containerStyle : PropTypes.object,
        colorMode      : PropTypes.string.isRequired,
        boxType        : PropTypes.oneOf([ 'square', 'circle' ]),
        value          : PropTypes.bool.isRequired,
        onValueChange  : PropTypes.func.isRequired
    }

    static defaultProps = {
        containerStyle : undefined,
        boxType        : 'square'
    }

    render() {
        const {
            containerStyle,
            colorMode,
            boxType,
            ...restProps
        } = this.props;

        const styles = style(colorMode);

        return (
            <CheckBox
                {...restProps}
                animationDuration = {0.2}
                onFillColor       = {colors[colorMode].PRIMARY}
                onTintColor       = {colors[colorMode].PRIMARY}
                tintColors={{
                    true  : colors[colorMode].PRIMARY,
                    false : colors[colorMode].TEXT_SECONDARY
                }}
                onCheckColor      = {colorMode === 'light' ? colors.WHITE_MAIN : 'rgba(0, 0, 0, 0.8)'}
                style             = {[ styles.containerStyle, containerStyle ]}
                boxType           = {boxType}
            />
        );
    }
}

export default CustomCheckbox;
