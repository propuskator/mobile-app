import React, {
    PureComponent
}                                 from 'react';
import PropTypes                   from 'prop-types';
import {
    View
}                                  from 'react-native';

import Icon                        from '../../../new-ui-kit/Icon';
import AppLogo                     from '../../../new-ui-kit/AppLogo/AppLogo';

import colors                      from '../../../../new-assets/constants/colors';

import style                       from './HeadingStyles';


class Heading extends PureComponent {
    static propTypes = {
        headingStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        onSettingsClick : PropTypes.func,
        onGoBack        : PropTypes.func,
        // t              : PropTypes.func.isRequired,
        colorMode       : PropTypes.string.isRequired,
        withBackIcon    : PropTypes.bool
    }

    static defaultProps = {
        headingStyle    : void 0,
        onSettingsClick : void 0,
        onGoBack        : void 0,
        withBackIcon    : false
    }

    render() {
        const {
            onSettingsClick,
            onGoBack,
            colorMode,
            headingStyle,
            // t,
            withBackIcon
        } = this.props;
        const styles = style(colorMode);

        return (
            <View style={[ styles.container, headingStyle ]}>
                <View style={styles.content}>
                    { withBackIcon && onGoBack
                        ? (
                            <View style = {styles.leftBar}>
                                <View style={styles.backIcon}>
                                    <Icon
                                        type    = 'arrowRight'
                                        size    = {28}
                                        color   = {colors[colorMode].TEXT_PRIMARY}
                                        onPress = {onGoBack}
                                    />
                                </View>
                            </View>
                        ) : null
                    }
                    { onSettingsClick
                        ? (
                            <View style = {styles.rightBar}>
                                <Icon
                                    size    = {28}
                                    color   = {colors[colorMode].TEXT_PRIMARY}
                                    type    = 'settings'
                                    onPress = {onSettingsClick}
                                />
                            </View>
                        ) : null
                    }
                    <AppLogo />
                </View>
            </View>
        );
    }
}

export default Heading;
