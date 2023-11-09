import React            from 'react';
import PropTypes        from 'prop-types';
import {
    View,
    Image
}                       from 'react-native';
import { connect }      from 'react-redux';

import Text             from '../Text';
import Button           from '../Button';

import style            from './ScreenStubStyles';


function ScreenStub(props) {
    const {
        DefaultIcon, title, subtitle, buttonText,
        onButtonPress, colorMode, iconStyle, iconSize
    } = props;

    const styles = style(colorMode);

    return (
        <View style={styles.emptyContainer}>
            <Image
                style  = {[
                    styles.emptyIcon,
                    iconStyle
                ]}
                source = {DefaultIcon}
                height = {iconSize || 200}
                width  = {iconSize || 200}
            />

            <View style={styles.emptyTextContainer}>
                <Text
                    variant = 'headline2'
                    style   = {styles.emptyTitle}
                >
                    {title}
                </Text>

                <Text
                    variant = 'caption1'
                    style   = {styles.emptySubtitle}
                >
                    {subtitle}
                </Text>
            </View>

            { onButtonPress
                ? <Button
                    type             = 'secondary'
                    title            = {buttonText}
                    containerStyle   = {styles.buttonContainer}
                    onPress          = {onButtonPress}
                    allowFontScaling = {false}
                />
                : null
            }
        </View>
    );
}

ScreenStub.propTypes = {
    DefaultIcon   : PropTypes.any.isRequired,
    title         : PropTypes.string.isRequired,
    subtitle      : PropTypes.string.isRequired,
    buttonText    : PropTypes.string,
    onButtonPress : PropTypes.func,
    colorMode     : PropTypes.string.isRequired,
    iconStyle     : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    iconSize : PropTypes.number
};

ScreenStub.defaultProps = {
    buttonText    : '',
    iconStyle     : void 0,
    onButtonPress : void 0,
    iconSize      : void 0
};

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(ScreenStub);
