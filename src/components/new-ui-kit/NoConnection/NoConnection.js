import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { View }               from 'react-native';
import { withTranslation }    from 'react-i18next';
import PropTypes              from 'prop-types';

import Text                   from '../Text';

import style                  from './NoConnectionStyles';

class NoConnection extends Component {
    static propTypes = {
        isNoConnectScreenVisible : PropTypes.bool.isRequired,
        t                        : PropTypes.func.isRequired,
        colorMode                : PropTypes.string.isRequired

    };

    render() {
        const { isNoConnectScreenVisible, t, colorMode } = this.props;
        const styles = style(colorMode);

        if (!isNoConnectScreenVisible) {
            return null;
        }

        return (
            <View style={styles.container}>
                <View style={styles.shadowBlock}>
                    <Text style={styles.text}>
                        {t('Try to restore connection...')}
                    </Text>
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        isNoConnectScreenVisible : state.connection.isNoConnectScreenVisible,
        colorMode                : state.theme.mode
    })
)(withTranslation()(NoConnection));
