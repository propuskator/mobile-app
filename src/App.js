import 'react-native-gesture-handler';
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { Provider }             from 'react-redux';
import { NavigationContainer }  from '@react-navigation/native';
import { ActionSheetProvider }  from '@expo/react-native-action-sheet';
import TipProvider              from 'react-native-tip';
import { withTranslation }      from 'react-i18next';

import WithDarkTheme            from './components/hoc/withDarkTheme';
import MainLayout               from './components/layouts/MainLayout';
import LINKING                  from './new-assets/constants/linking';
import {
    navigationRef,
    isReadyRef
}                               from './utils/NavigationHelper';
import store                    from './store';
import './utils/i18n/index';


class App extends PureComponent {
    static propTypes = {
        t : PropTypes.func.isRequired
    };

    state = {
        activeRoute : void 0
    }

    handleReady = () => {
        isReadyRef.current = true;
        this.handleChangeRoute();
    }

    handleChangeRoute = () => {
        try {
            const activeRoute = navigationRef.current.getCurrentRoute().name;

            if (activeRoute) this.setState({ activeRoute });
        } catch (error) {
            console.log('handleChangeRoute()', error);
        }
    }

    render() {
        const { t } = this.props;
        const { activeRoute } = this.state;

        return (
            <NavigationContainer
                ref           = {navigationRef}
                linking       = {LINKING}
                onReady       = {this.handleReady}
                onStateChange = {this.handleChangeRoute}
            >
                <TipProvider />
                <Provider store={store}>
                    <WithDarkTheme activeRoute={activeRoute} t={t}>
                        <ActionSheetProvider>
                            <MainLayout />
                        </ActionSheetProvider>
                    </WithDarkTheme>
                </Provider>
            </NavigationContainer>
        );
    }
}

export default withTranslation()(App);
