import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { CheckBox }                from 'react-native-elements';

import colors                      from '../../../assets/constants/colors';

import style                       from './CheckboxStyles';

class CustomCheckbox extends PureComponent {
    static propTypes = {
        containerStyle : PropTypes.object,
        wrapperStyle   : PropTypes.object,
        textStyle      : PropTypes.object,
        checkedColor   : PropTypes.string,
        colorMode      : PropTypes.string,
        color          : PropTypes.oneOf([ 'green', 'orange' ])
    }

    static defaultProps = {
        containerStyle : undefined,
        wrapperStyle   : undefined,
        textStyle      : undefined,
        colorMode      : 'light',
        color          : 'orange',
        checkedColor   : ''
    }

    render() {
        const {
            containerStyle,
            wrapperStyle,
            textStyle,
            colorMode,
            color,
            checkedColor,
            ...restProps
        } = this.props;

        const checkedColorByColorType = {
            orange : colors[colorMode].BUTTON_PRIMARY,
            green  : colors[colorMode].DARK_GREEN
        };
        const checkedColorByType = checkedColorByColorType[color];
        const styles = style(colorMode);

        return (
            <CheckBox
                titleProps     = {{ allowFontScaling: false }}
                containerStyle = {[ styles.containerStyle, containerStyle ]}
                wrapperStyle   = {[ styles.wrapperStyle, wrapperStyle ]}
                textStyle      = {textStyle}
                checkedColor   = {checkedColorByType || checkedColor}
                {...restProps}
            />
        );
    }
}

export default CustomCheckbox;
