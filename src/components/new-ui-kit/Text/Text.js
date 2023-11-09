import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';

import { Text }                    from 'react-native-elements';

import { MAX_SCALE_MULTIPLIER }    from '../../../new-assets/constants/theme';

import {
    allowFontScaling as platformAllowFontScaling
}                                  from '../../../utils/platform';

import styles                      from './TextStyles';

class CustomText extends PureComponent {
    static propTypes = {
        colorMode : PropTypes.string.isRequired,
        variant   : PropTypes.oneOf([
            'headline1',
            'headline2',
            'headline3',
            'headline4',
            'body1',
            'body2',
            'caption1',
            'caption2'
        ]),
        color : PropTypes.oneOf([
            'black',
            'grey',
            'greyMedium',
            'greyLight',
            'greyStrong',
            'primary',
            'greenDark',
            'salad',
            'red'
        ]),
        containerStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        style : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        allowFontScaling : PropTypes.bool
    }

    static defaultProps = {
        variant          : 'body1',
        color            : 'black',
        containerStyle   : void 0,
        style            : void 0,
        allowFontScaling : void 0
    }

    getStyles = () => {
        const { variant, color, colorMode, containerStyle } = this.props;
        const style = styles(colorMode);

        return [
            style.container,
            style[color],
            style[variant],
            this.props.style,
            containerStyle
        ];
    }

    render() {
        const { allowFontScaling } = this.props;

        return (
            <Text
                allowFontScaling = {allowFontScaling}
                {...this.props}
                maxFontSizeMultiplier={MAX_SCALE_MULTIPLIER}
                style = {this.getStyles()}
            />
        );
    }
}

export default connect(
    (state, ownProps) => {
        const allowFontScaling = [ true, false ]?.includes(ownProps?.allowFontScaling)
            ? ownProps?.allowFontScaling
            : platformAllowFontScaling;

        return {
            colorMode : state.theme.mode,
            allowFontScaling
        };
    }
)(CustomText);

