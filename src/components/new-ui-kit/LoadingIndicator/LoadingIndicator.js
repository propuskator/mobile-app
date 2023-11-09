import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import {  View, ActivityIndicator } from 'react-native';
import { withTranslation }          from 'react-i18next';

import StatusBar                    from '../../new-ui-kit/StatusBar';
import Text                         from '../../new-ui-kit/Text';
import AppLogo                      from '../../new-ui-kit/AppLogo';
import colors                       from '../../../new-assets/constants/colors';

import * as sessionActions          from '../../../actions/session';
import {
    isInternetConnectedSelector,
    isBrokerConnectedSelector,
    isTryingToConnectVisibleSelector
}                                   from '../../../selectors/connection';


import style                        from './LoadingIndicatorStyles.js';

class LoadingIndicator extends PureComponent {
    static propTypes = {
        isInternetReachable      : PropTypes.bool,
        isBrokerConnected        : PropTypes.bool.isRequired,
        isTryingToConnectVisible : PropTypes.bool.isRequired,
        colorMode                : PropTypes.string.isRequired,
        t                        : PropTypes.func.isRequired,
        withLogo                 : PropTypes.bool,
        containerStyles          : PropTypes.object.isRequired,
        color                    : PropTypes.string
    }

    static defaultProps = {
        isInternetReachable : true,
        withLogo            : true,
        color               : 'white'
    }

    render() {
        const {
            isInternetReachable, isBrokerConnected,
            isTryingToConnectVisible, colorMode, t, withLogo,
            containerStyles, color
        } = this.props;
        const styles = style(colorMode);

        const loadingText = isBrokerConnected || !isTryingToConnectVisible
            ? t('Loading...')
            : t('Trying to connect...');
        const statusBarColor = color || 'white';

        return (
            <>
                <StatusBar color={statusBarColor}  withHeight={false}  />
                <View
                    style={[
                        styles.container,
                        containerStyles
                    ]}>
                    { withLogo
                        ? <View style={styles.logo}><AppLogo height={35} /></View>
                        : null
                    }

                    <View style={styles.infoContainer}>
                        <ActivityIndicator size='large' color={colors[colorMode].PRIMARY} />
                        <Text style={styles.info}>
                            { isInternetReachable
                                ? loadingText
                                : t('Waiting for network…')
                            }
                        </Text>
                    </View>
                </View>
            </>

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
