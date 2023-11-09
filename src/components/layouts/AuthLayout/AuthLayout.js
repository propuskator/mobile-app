import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import { View }                    from 'react-native';

import * as userActions          from '../../../actions/users';
import * as homieActions          from '../../../actions/homie/homie';


import * as accessPoints           from '../../../actions/accessPoints';


import style                       from './AuthLayoutStyles';

class AuthLayout extends PureComponent {
    static propTypes = {
        children : PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        colorMode : PropTypes.string.isRequired
    }

    static defaultProps = {
        children : undefined
    }


    render() {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    {
        ...accessPoints,
        ...userActions,
        ...homieActions
    }
)(AuthLayout);
