import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import { View }                     from 'react-native';

import SnackBar                     from '../../new-ui-kit/SnackBar/SnackBar';
import InitializeLayout             from '../InitializeLayout';
import style                        from './MainLayoutStyles';


class MainLayout extends PureComponent {
    static propTypes = {
        colorMode : PropTypes.string.isRequired
    }

    render() {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <SnackBar />
                <InitializeLayout />
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(MainLayout);
