import React, { PureComponent }            from 'react';
import PropTypes                           from 'prop-types';
import { connect }                         from 'react-redux';
import {
    View,
    TouchableOpacity,
    ActivityIndicator
}                                          from 'react-native';
import { debounce }                        from 'throttle-debounce';
import { Image }                           from 'react-native-elements';

import { isIOS }                           from '../../../utils/platform';
import Text                                from '../Text';
import Toggle                              from '../Toggle';
import Icon                                from '../Icon';
import SvgUriIcon                          from '../SvgUriIcon';

import colors                              from '../../../new-assets/constants/colors';
import CheckMark                           from '../../../new-assets/icons/static_icons/checkMarkSm.svg';
import RadioButton                         from '../RadioButton';

import style                               from './TouchableBlockStyles';

const DEBOUNCE_TIMEOUT = isIOS ? 300 : 1000;
const stylesPropTypes = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
]);

class TouchableBlock extends PureComponent {
    static propTypes = {
        title    : PropTypes.string,
        subtitle : PropTypes.string,
        value    : PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        color : PropTypes.oneOf([
            'greyLight'
        ]),
        size                : PropTypes.oneOf([ 'S', 'M', 'L' ]),
        colorMode           : PropTypes.string.isRequired,
        containerStyle      : stylesPropTypes,
        titleStyle          : stylesPropTypes,
        subtitleStyle       : stylesPropTypes,
        valueStyle          : stylesPropTypes,
        rightPartStyle      : stylesPropTypes,
        iconStyle           : stylesPropTypes,
        renderCustomContent : PropTypes.func,
        withArrow           : PropTypes.bool,
        isDisabled          : PropTypes.bool,
        svgUrl              : PropTypes.string,
        imageUrl            : PropTypes.string,
        iconSize            : PropTypes.number,
        onClick             : PropTypes.func,
        onLongPress         : PropTypes.func,
        DefaultIcon         : PropTypes.any,
        withToggle          : PropTypes.bool,
        withRadio           : PropTypes.bool,
        isAsync             : PropTypes.bool,
        isSelected          : PropTypes.bool,
        titleNumberOfLines  : PropTypes.number,
        isLoading           : PropTypes.bool,
        isTransparent       : PropTypes.bool,
        allowFontScaling    : PropTypes.bool
    }

    static defaultProps = {
        titleNumberOfLines  : 1,
        title               : '-',
        subtitle            : '',
        color               : '',
        size                : 'M',
        value               : void 0,
        containerStyle      : void 0,
        titleStyle          : void 0,
        subtitleStyle       : void 0,
        rightPartStyle      : void 0,
        valueStyle          : void 0,
        renderCustomContent : void 0,
        iconStyle           : void 0,
        withArrow           : true,
        isDisabled          : false,
        isSelected          : false,
        svgUrl              : '',
        imageUrl            : '',
        iconSize            : 40,
        onClick             : void 0,
        onLongPress         : void 0,
        DefaultIcon         : void 0,
        withToggle          : false,
        withRadio           : false,
        isAsync             : false,
        isLoading           : false,
        isTransparent       : false,
        allowFontScaling    : void 0
    }

    state = {
        isLoading  : false,
        refreshKey : +new Date()
    }

    getToggleValue = () => {
        return [ 'true', true ]?.includes(this.props.value);
    }

    handleToggleValue = async ({ value }) => {
        const { isLoading } = this.state;
        const { isAsync } = this.props;

        if (!isAsync) return this.props.onClick({ value, onError: () => this.setState({ refreshKey: +new Date() }) });
        if (isLoading) return;

        try {
            this.setState({ isLoading: true });
            await this.props.onClick({ value, onError: () => this.setState({ refreshKey: +new Date() }) });
            this.setState({ isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false });
        }
    }

    handleClick = debounce(DEBOUNCE_TIMEOUT, true, () => {
        const { onClick } = this.props;

        if (onClick) {
            onClick({ onError: () => this.setState({ refreshKey: +new Date() }) });
        }
    })

    getContainerStyle = () => {
        const {
            colorMode, containerStyle, isDisabled,
            isTransparent, color, size
        } = this.props;
        const styles = style(colorMode);

        return [
            styles.container,
            styles[color],
            styles[`size${size}`],
            containerStyle,
            isDisabled ? styles.disabled : void 0,
            isTransparent ? styles.transparent : void 0
        ];
    }

    render() {  // eslint-disable-line  complexity
        const {
            title, subtitle, titleStyle, subtitleStyle, iconStyle,
            value, colorMode, svgUrl, imageUrl, iconSize,
            onClick, onLongPress, renderCustomContent,
            valueStyle, rightPartStyle,
            withArrow, isDisabled, DefaultIcon,
            isSelected, withToggle, withRadio, titleNumberOfLines,
            allowFontScaling
        } = this.props;
        const isLoading = this.state.isLoading || this.props.isLoading;

        const styles = style(colorMode);
        const Component = !onClick || isDisabled || withToggle ? View : TouchableOpacity;
        const withArrowIcon = withArrow && !isSelected && !withToggle;

        return (
            <Component
                style   = {this.getContainerStyle()}
                onPress = {onClick ? this.handleClick : void 0}
                onLongPress = {onLongPress}
            >
                { renderCustomContent
                    ? renderCustomContent()
                    : (
                        <>
                            <View style={styles.leftPart}>
                                { svgUrl || imageUrl
                                    ? (
                                        <View style={[ styles.iconWrapper, iconStyle ]}>
                                            {
                                                svgUrl
                                                    ? <SvgUriIcon
                                                        key    = {svgUrl}
                                                        uri    = {svgUrl}
                                                        width  = {iconSize}
                                                        height = {iconSize}
                                                    />
                                                    : <Image
                                                        source     = {{ uri: imageUrl }}
                                                        style      = {styles.image}
                                                        transition = {false}
                                                        width      = {iconSize}
                                                        height     = {iconSize}
                                                    />
                                            }
                                        </View>
                                    ) : null
                                }
                                { DefaultIcon
                                    ? (
                                        <View style={[ styles.iconWrapper, iconStyle ]} >
                                            <DefaultIcon
                                                key    = 'default'
                                                fill   = {colors[colorMode].PRIMARY}
                                                width  = {iconSize}
                                                height = {iconSize}
                                            />
                                        </View>
                                    ) : null
                                }
                                { title || subtitle
                                    ? (
                                        <View
                                            style={[
                                                styles.textWrapper,
                                                subtitle ? styles.withSubtitle : void 0
                                            ]}
                                        >
                                            { title
                                                ? (
                                                    <Text
                                                        containerStyle   = {[ styles.title, titleStyle ]}
                                                        numberOfLines    = {titleNumberOfLines || 1}
                                                        allowFontScaling = {allowFontScaling}
                                                    >
                                                        { title }
                                                    </Text>
                                                ) : null
                                            }
                                            { subtitle
                                                ? (
                                                    <Text
                                                        containerStyle   = {[ styles.subtitle, subtitleStyle ]}
                                                        numberOfLines    = {1}
                                                        allowFontScaling = {allowFontScaling}
                                                    >
                                                        { subtitle }
                                                    </Text>
                                                ) : null
                                            }
                                        </View>
                                    ) : null
                                }
                            </View>
                            { value || withArrow || withToggle || isSelected || withRadio
                                ? (
                                    <View
                                        style={[
                                            styles.rightPart,
                                            rightPartStyle,
                                            withToggle || withRadio ? styles.rightPartWithToggle : void 0,
                                            !value && !(withRadio || withToggle)  ? styles.onlyArrow : void 0
                                        ]}
                                    >
                                        { withToggle
                                            ? (
                                                <Toggle
                                                    key          = {this.state.refreshKey}
                                                    value        = {this.getToggleValue()}
                                                    onChange     = {this.handleToggleValue}
                                                    isProcessing = {isLoading}
                                                    isClickable  = {!isLoading}
                                                />
                                            ) : null
                                        }
                                        { withRadio
                                            ? (
                                                <RadioButton
                                                    isChecked = {value}
                                                    onPress   = {this.handleToggleValue}
                                                />
                                            ) : null
                                        }
                                        { value && !withToggle && !withRadio && !isLoading
                                            ? (
                                                <View style={styles.valueWrapper}>
                                                    <Text
                                                        containerStyle   = {[ styles.value, valueStyle ]}
                                                        numberOfLines    = {1}
                                                        allowFontScaling = {allowFontScaling}
                                                    >
                                                        {value}
                                                    </Text>
                                                </View>
                                            ) : null
                                        }
                                        { withArrowIcon && !isLoading
                                            ? (
                                                <Icon
                                                    color = {colors.GREY_MEDIUM}
                                                    type  = 'arrowRight'
                                                />
                                            ) : null
                                        }
                                        { isSelected && !isLoading
                                            ? (
                                                <CheckMark
                                                    width  = {20}
                                                    height = {20}
                                                    fill   = {colors[colorMode].PRIMARY}
                                                />
                                            ) : null
                                        }
                                        { isLoading && !withToggle && !withRadio
                                            ? (
                                                <ActivityIndicator
                                                    size  = 'small'
                                                    color = {colors[colorMode].PRIMARY}
                                                    style = {styles.loader}
                                                />
                                            ) : null
                                        }
                                    </View>
                                ) : null
                            }
                        </>
                    )
                }
            </Component>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    void 0
)(TouchableBlock);
