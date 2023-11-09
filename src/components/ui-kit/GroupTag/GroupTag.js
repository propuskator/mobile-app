import React, { PureComponent }             from 'react';
import PropTypes                            from 'prop-types';
import {
    View,
    ActivityIndicator
}                                           from 'react-native';
import {
    TouchableOpacity
}                                           from 'react-native-gesture-handler';

import toast                                from '../../../utils/Toast';
import config                               from '../../../config';
import addOutlinedIcon                      from '../../../assets/icons/addOutlinedIcon.svg';
import addFilledIcon                        from '../../../assets/icons/addFilledIcon.svg';
import allGroupsIcon                        from '../../../assets/static_icons/all_groups.svg';
import colors                               from '../../../assets/constants/colors';

import SvgUriIcon                           from '../../ui-kit/SvgUriIcon/SvgUriIcon';
import Text                                 from '../../ui-kit/Text';
import {
    checkIsDefaultColor
}                                           from '../../screens/utils/groupLogo';

import style                                from './GroupTagStyles';

const ICONS_BY_TYPE = {
    addOutlined : addOutlinedIcon,
    addFilled   : addFilledIcon,
    all         : allGroupsIcon
};

class GroupTag extends PureComponent {
    static propTypes = {
        variant : PropTypes.oneOf([
            'outlined',
            'filled'
        ]).isRequired,
        label     : PropTypes.string,
        colorMode : PropTypes.string.isRequired,
        onClick   : PropTypes.func,
        size      : PropTypes.oneOf([
            'S',
            'M'
        ]),
        groupStyle    : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        labelStyle    : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        circleStyle   : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        isSelected    : PropTypes.bool,
        isLoading     : PropTypes.bool,
        type          : PropTypes.string,
        logoPath      : PropTypes.string,
        color         : PropTypes.string,
        withNameToast : PropTypes.bool
    }

    static defaultProps = {
        label         : void 0,
        onClick       : void 0,
        size          : void 0,
        groupStyle    : void 0,
        labelStyle    : void 0,
        circleStyle   : void 0,
        isSelected    : false,
        isLoading     : false,
        type          : void 0,
        logoPath      : void 0,
        color         : void 0,
        withNameToast : false
    }

    renderFallback = () => {
        const {
            colorMode, label
        } = this.props;
        const styles = style(colorMode);

        return (
            <Text
                style         = {[ styles.logoLetter ]}
                numberOfLines = {1}
            >
                {label?.slice(0, 1)}
            </Text>
        );
    }

    getContainerStyle = () => {
        const { colorMode, groupStyle, size } = this.props;
        const styles = style(colorMode);

        return [
            styles.container,
            styles[`containerSize${size}`],
            groupStyle
        ];
    }

    getCircleStyle = ({ backgroundColor } = {}) => {
        const {
            circleStyle, variant, colorMode,
            size, type, color, groupStyle
        } = this.props;
        const styles = style(colorMode);

        return [
            styles.circle,
            styles[`circeSize${size}`],
            styles[variant],
            groupStyle,
            styles[type],
            circleStyle,
            ...color ? [ { backgroundColor } ] : []
        ];
    }

    getSelectedCircleStyle = ({ selectedCircleColor } = {}) => {
        const { colorMode, size, color } = this.props;
        const styles = style(colorMode);

        return [
            styles.selectedCircle,
            styles[`selectedCircleSize${size}`],
            ...color ? [ { borderColor: selectedCircleColor } ] : []
        ];
    }

    handleShowName = () => {
        const { label } = this.props;

        toast.show(label, 2);
    }

    render() {
        const {
            colorMode, label, onClick, logoPath, type,
            size, labelStyle, isSelected,
            isLoading, color, withNameToast
        } = this.props;
        const styles = style(colorMode);

        const Component = onClick && !isLoading ? TouchableOpacity : View;
        const Icon = ICONS_BY_TYPE[type];
        const logoSrc = Icon || !logoPath ?  void 0 : `${config.API_URL}/${logoPath}`;
        const isDefaultBg = checkIsDefaultColor(color);

        const backgroundColor = isDefaultBg ? colors[colorMode].LOGO_DEFAULT_COLOR : color;
        const selectedCircleColor = isDefaultBg || !color
            ? colors[colorMode].DARK_GREEN
            : color;

        return (
            <Component
                style   = {this.getContainerStyle()}
                onPress = {!isLoading ? onClick : void 0}
                onLongPress = {withNameToast ? this.handleShowName : void 0}
            >
                <View style={this.getCircleStyle({ backgroundColor })}>
                    { !isLoading && type && Icon
                        ? <Icon style={[ styles.icon, styles[`iconSize${size}`] ]} />
                        : null
                    }
                    { !isLoading && logoPath && logoSrc
                        ? (
                            <SvgUriIcon
                                iconStyle = {styles.icon}
                                key       = {logoSrc}
                                uri       = {logoSrc}
                                width     = {size === 'M' ? 64 : 54}
                                height    = {size === 'M' ? 64 : 54}
                                fallback  = {this.renderFallback()}
                            />
                        ) : null
                    }
                    {  !type && !Icon && !logoPath && label && !isLoading
                        ? this.renderFallback()
                        : null
                    }
                    { isLoading
                        ? (
                            <View style={styles.loaderWrapper}>
                                <ActivityIndicator
                                    style = {styles.loader}
                                    size  = 'small'
                                    color = {colors[colorMode].PRIMARY}
                                />
                            </View>
                        ) : null
                    }
                    { isSelected
                        ? <View style={this.getSelectedCircleStyle({ selectedCircleColor })} />
                        : null
                    }
                </View>

                { label
                    ? (
                        <Text
                            style         = {[ styles.label, labelStyle ]}
                            numberOfLines = {1}
                        >
                            {!isLoading ? label : null}
                        </Text>
                    )
                    : void 0
                }
            </Component>
        );
    }
}

export default GroupTag;
