import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import {
    View
}                                  from 'react-native';

import style                       from './DividerStyles';

class Divider extends PureComponent {
    static propTypes = {
        containerStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        colorMode : PropTypes.string.isRequired,
        variant   : PropTypes.oneOf([
            'dark'
        ])
    }

    static defaultProps = {
        containerStyle : void 0,
        variant        : void 0
    }

    render() {
        const { colorMode, containerStyle, variant } = this.props;
        const styles = style(colorMode);

        return (
            <View
                style={[ styles.container, containerStyle, styles[variant] ]}
            />
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(Divider);

