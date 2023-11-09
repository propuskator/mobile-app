import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }            from 'react-redux';

import { View }                    from 'react-native';

import styles                      from './ViewStyles';

class CustomText extends PureComponent {
    static propTypes = {
        colorMode : PropTypes.string.isRequired
    }

    render() {
        const { colorMode } = this.props;
        const style = styles(colorMode);

        return (
            <View
                {...style}
                {...this.props}
            />
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(CustomText);

