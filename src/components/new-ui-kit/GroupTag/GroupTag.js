import React, { PureComponent }             from 'react';
import PropTypes                            from 'prop-types';
import {
    View,
    ActivityIndicator,
    TouchableOpacity
}                                           from 'react-native';

import toast                                from '../../../utils/Toast';
import config                               from '../../../config';

import addGroupIcon                         from '../../../new-assets/icons/groups/add_group.svg';
import allGroupsIconLight                   from '../../../new-assets/icons/groups/all_groups_light.svg';
import allGroupsIconDark                    from '../../../new-assets/icons/groups/all_groups_dark.svg';
import colors                               from '../../../new-assets/constants/colors';

import SvgUriIcon                           from '../../new-ui-kit/SvgUriIcon';
import Text                                 from '../../new-ui-kit/Text';
import Icon                                 from '../../new-ui-kit/Icon';

import style                                from './GroupTagStyles';


class GroupTag extends PureComponent {
    static propTypes = {
        variant : PropTypes.oneOf([
            'outlined',
            'filled',
            'dashed'
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
        withNameToast : PropTypes.bool,
        withEditIcon  : PropTypes.bool
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
        withNameToast : false,
        withEditIcon  : false
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
            size, type, color
        } = this.props;
        const styles = style(colorMode);

        return [
            styles.circle,
            styles[`circeSize${size}`],
            styles[variant],
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

    getIconByType = (type) => {
        const { colorMode } = this.props;

        if (type === 'all') {
            return colorMode === 'light' ? allGroupsIconLight : allGroupsIconDark;
        } else if (type === 'add') {
            return addGroupIcon;
        }
    }

    getSelectedCircleColor = ({ color } = {}) => {
        const { colorMode, type } = this.props;

        if (type === 'add') return 'transparent';

        return !color ? colors[colorMode].PRIMARY : color;
    }

    render() {
        const {
            colorMode, label, onClick, logoPath, type,
            size, labelStyle, isSelected,
            isLoading, color, withNameToast,
            withEditIcon
        } = this.props;
        const styles = style(colorMode);

        const Component = onClick && !isLoading ? TouchableOpacity : View;
        const IconAsset = this.getIconByType(type);
        const logoSrc = IconAsset || !logoPath ?  void 0 : `${config.API_URL}/${logoPath}`;
        const selectedCircleColor = this.getSelectedCircleColor({ color });

        const backgroundColor = color;
        const allTabBg = colorMode === 'light' ? '#FFF' : selectedCircleColor;
        const addTagBg = colors[colorMode].ITEM_BG;

        return (
            <Component
                style   = {this.getContainerStyle()}
                onPress = {!isLoading ? onClick : void 0}
                onLongPress = {withNameToast ? this.handleShowName : void 0}
            >
                <View style={this.getCircleStyle({ backgroundColor })}>
                    { !isLoading && type && IconAsset
                        ? <IconAsset
                            style = {[ styles.icon, type !== 'all' ? styles[`iconSize${size}`] : void 0 ]}
                            {...type === 'all'
                                ? ({ color: allTabBg, fill: allTabBg, width: '100%', height: '100%' })
                                : null
                            }
                            {...type === 'add' ? ({ color: addTagBg, fill: addTagBg }) : {}}
                        />
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
                    {  !type && !IconAsset && !logoPath && label && !isLoading
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
                    { withEditIcon
                        ? <View style={styles.editIconContainer} pointerEvents='none'>
                            <Icon type='pencil' size={14} color={colors[colorMode].DEFAULT_ICON_COLOR} />
                        </View>
                        : null
                    }
                </View>

                { label
                    ? (
                        <Text
                            style         = {[
                                styles.label,
                                isSelected ? styles.selectedLabel : void 0,
                                labelStyle
                            ]}
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
