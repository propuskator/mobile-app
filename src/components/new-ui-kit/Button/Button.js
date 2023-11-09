import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { Button }                  from 'react-native-elements';
import { connect }                 from 'react-redux';

import { debounce }                from '../../../utils';
import colors                      from '../../../new-assets/constants/colors';
import { MAX_SCALE_MULTIPLIER }    from '../../../new-assets/constants/theme';

import {
    allowFontScaling as platformAllowFontScaling
}                                 from '../../../utils/platform';

import styles                      from './ButtonStyles';


class CustomButton extends PureComponent {
    static propTypes = {
        buttonStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        disabledStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        disabledTitleStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        type             : PropTypes.string,
        onPress          : PropTypes.func,
        containerStyle   : PropTypes.object,
        titleStyle       : PropTypes.object,
        isDisabled       : PropTypes.bool,
        colorMode        : PropTypes.string.isRequired,
        allowFontScaling : PropTypes.bool
    }


    static defaultProps = {
        type               : 'primary',
        buttonStyle        : void 0,
        disabledStyle      : void 0,
        disabledTitleStyle : void 0,
        onPress            : void 0,
        containerStyle     : void 0,
        titleStyle         : void 0,
        isDisabled         : void 0,
        allowFontScaling   : void 0
    }

    handlePress = debounce(() => {
        const { onPress } = this.props;

        if (!onPress) return;

        onPress();
    }, 300, true);

    getStyles = () => {
        const {
            buttonStyle,
            containerStyle,
            titleStyle,
            colorMode,
            type
        } = this.props;
        const style = styles(colorMode);

        return ({
            containerStyle : [ style.containerStyle, containerStyle ],
            titleStyle     : [
                style.titleStyle,
                (type === 'secondary') && style.titleSecondaryStyle,
                titleStyle
            ],
            buttonStyle : [
                style.buttonStyle,
                (type === 'secondary') && style.buttonSecondaryStyle,
                (type === 'clear') && style.buttonClearStyle,
                buttonStyle ]
        });
    }

    render() {
        const {
            onPress,
            isDisabled,
            type,
            colorMode,
            allowFontScaling,
            disabledStyle,
            disabledTitleStyle,
            ...restProps
        } = this.props;
        const customStyles = this.getStyles(colorMode);
        const style = styles(colorMode);

        return (
            <Button
                loadingProps = {{ color: type !== 'secondary' ? colors.WHITE_MAIN : colors[colorMode].PRIMARY }}
                {...restProps}
                {...customStyles}
                disabled           = {isDisabled}
                disabledStyle      = {[ style.buttonDisabled, disabledStyle ]}
                disabledTitleStyle = {[ style.buttonDisabledTitle, disabledTitleStyle ]}
                onPress            = {onPress ? this.handlePress : void 0}
                titleProps         = {{
                    allowFontScaling,
                    maxFontSizeMultiplier : MAX_SCALE_MULTIPLIER
                }}
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
)(CustomButton);
