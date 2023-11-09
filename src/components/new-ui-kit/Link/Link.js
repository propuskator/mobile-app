import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import {
    Linking
}                                  from 'react-native';

import Text                        from '../Text';

import style                       from './LinkStyles';

class Link extends PureComponent {
    static propTypes = {
        containerStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        children  : PropTypes.any,
        url       : PropTypes.string,
        colorMode : PropTypes.string.isRequired
    }

    static defaultProps = {
        containerStyle : void 0,
        children       : null,
        url            : void 0
    }

    handlePressLink = ()  => Linking.openURL(this.props.url)

    render() {
        const { children, containerStyle, url, colorMode, ...rest } = this.props;
        const styles = style(colorMode);

        return (
            <Text
                {...rest}
                containerStyle = {[
                    styles.container,
                    containerStyle,
                    url ? styles.withUnderline : void 0
                ]}
                color   = 'primary'
                onPress = {url ? this.handlePressLink : void 0}
            >
                { children }
            </Text>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(Link);

