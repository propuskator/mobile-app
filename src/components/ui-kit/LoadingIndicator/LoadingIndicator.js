import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import {  View, ActivityIndicator } from 'react-native';
import { withTranslation }          from 'react-i18next';

import Text                         from '../../ui-kit/Text';
import AppLogo                      from '../AppLogo/AppLogo';

import * as sessionActions          from '../../../actions/session';
import colors                       from '../../../assets/constants/colors';
import {
    isInternetConnectedSelector,
    isBrokerConnectedSelector,
    isTryingToConnectVisibleSelector
}                                   from '../../../selectors/connection';


import style                        from './LoadingIndicatorStyles.js';

class LoadingIndicator extends PureComponent {
    static propTypes = {
        isInternetReachable      : PropTypes.bool,
        isTryingToConnectVisible : PropTypes.bool.isRequired,
        isBrokerConnected        : PropTypes.bool.isRequired,
        t                        : PropTypes.func.isRequired,
        colorMode                : PropTypes.string.isRequired
    }

    static defaultProps = {
        isInternetReachable : true
    }

    render() {
        const { isInternetReachable, isTryingToConnectVisible, isBrokerConnected, colorMode, t } = this.props;
        const loadingText = isBrokerConnected || !isTryingToConnectVisible
            ? t('Loading...')
            : t('Trying to connect...');

        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <AppLogo style={styles.title} />

                <View style={styles.infoContainer}>
                    <ActivityIndicator size='large' color={colors[colorMode].PRIMARY} />
                    <Text style={styles.info}>
                        {
                            isInternetReachable
                                ? loadingText
                                : t('Waiting for network...')
                        }
                    </Text>
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        isTryingToConnectVisible : isTryingToConnectVisibleSelector(state),
        isInternetReachable      : isInternetConnectedSelector(state),
        isBrokerConnected        : isBrokerConnectedSelector(state),
        colorMode                : state.theme.mode
    }),
    { ...sessionActions }
)(withTranslation()(LoadingIndicator));
