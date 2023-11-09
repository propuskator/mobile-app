import React, { PureComponent }             from 'react';
import PropTypes                            from 'prop-types';
import { connect }                          from 'react-redux';
import {  AppState, Linking }                        from 'react-native';
import NetInfo                              from '@react-native-community/netinfo';

import  { SiriShortcutsEvent }              from 'react-native-siri-shortcut';
import BackgroundTimer                      from 'react-native-background-timer';
import { isAndroid }                        from '../../../utils/platform';
import { checkBiometricPermission }         from '../../../utils/TouchId';
import {
    isAppStateActiveAfterBackground,
    isAppStateSwitchToBackground
}                                           from '../../../utils/appState';
import * as connectionActions               from '../../../actions/connection';
import * as snackbarActions                 from '../../../actions/snackbar';
import * as sessionActions                  from '../../../actions/session';
import * as accessPoints                    from '../../../actions/accessPoints';
import * as fetcheActions                   from '../../../actions/fetche';
import sessionManager                       from '../../../SessionManager';
import AuthNavigation                       from '../../navigation/AuthNavigation';

import {
    isInternetConnectedSelector,
    isBrokerConnectedSelector,
    isBrokerConectionLoadingSelector,
    isNoConnectScreenVisibleSelector,
    isConnectingAfterBackgroundSelector
}                                   from '../../../selectors/connection';
import {

    isUserStateInitializedSelector,
    isUserLogedInSelector,
    isSessionCheckedSelector
}                                   from '../../../selectors/session';

const TIMEOUT_TO_LOGOUT = 60000;
const BROKER_RECONNECT_TIMEOUT = 5000;

class InitializeLayout extends PureComponent {
    static propTypes = {
        networkStatusUpdated             : PropTypes.func.isRequired,
        // isUserStateInitialized           : PropTypes.bool.isRequired,
        setInitialDataFromStorage        : PropTypes.func.isRequired,
        triggerAccessPointWithQueue      : PropTypes.func.isRequired,
        updateStateAfterBackgroundSwitch : PropTypes.func.isRequired,
        initialFetch                     : PropTypes.func.isRequired,
        updateAppState                   : PropTypes.func.isRequired,
        logout                           : PropTypes.func.isRequired,
        // isUserLogedIn                    : PropTypes.bool.isRequired,
        // isBrokerConecting                : PropTypes.bool.isRequired,
        isNoConnectScreenVisible         : PropTypes.bool.isRequired,
        reconectAfterConectLost          : PropTypes.func.isRequired
        // isSessionChecked                 : PropTypes.bool.isRequired,
        // isSessionChecking                : PropTypes.bool.isRequired
    }


    constructor(props) {
        super(props);
        this.state = {
            isInitialDataLoading : true
        };
        this.unsubscribeNetworkListener = () => {};
        this.appState = 'active';
    }

    async componentDidMount() {
        this.unsubscribeNetworkListener = NetInfo.addEventListener(this.handleNetworkStateChange);
        const isAppOpenByDeepLink = await Linking.getInitialURL();

        await sessionManager.init(isAppOpenByDeepLink);

        AppState.addEventListener('change', this.handleAppStateChange);

        SiriShortcutsEvent.addListener(
            'SiriShortcutListener',
            this.handleAddSiriShortcut
        );
        await this.fetchData(isAppOpenByDeepLink);
    }


    componentDidUpdate(prevProps) {
        const prevNoConnectionScreen = prevProps.isNoConnectScreenVisible;
        const { isNoConnectScreenVisible, reconectAfterConectLost } = this.props;
        const shouldFetchData = prevNoConnectionScreen && !isNoConnectScreenVisible;

        if (shouldFetchData) {
            reconectAfterConectLost();
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        SiriShortcutsEvent.removeListener(
            'SiriShortcutListener',
            this.handleAddSiriShortcut
        );
    }


    fetchData = async (isAppOpenByDeepLink) => {
        const { setInitialDataFromStorage, initialFetch } = this.props;
        const isBiometricEnable = await checkBiometricPermission();

        if (isBiometricEnable) this.setState({ isInitialDataLoading: false });

        await setInitialDataFromStorage();

        if (!isAppOpenByDeepLink) {
            await initialFetch();
        }
        this.setState({ isInitialDataLoading: false });
    }

    handleAddSiriShortcut = ({ userInfo }) => {
        const { triggerAccessPointWithQueue } = this.props;
        const { topic, value, accessPointName } = userInfo;

        triggerAccessPointWithQueue({ topic, value, accessPointName });
    }

    handleNetworkStateChange = state => {
        const { networkStatusUpdated } = this.props;

        if (state.isInternetReachable === null) return;

        networkStatusUpdated({ isInternetReachable: state.isInternetReachable });
    }

    handleAppStateChange = async nextAppState => {
        const isBiometryEnabled = await checkBiometricPermission();
        const isSetTimeoutForLogout = isBiometryEnabled && isAppStateSwitchToBackground(this.appState, nextAppState);
        const { updateStateAfterBackgroundSwitch, updateAppState } = this.props;

        if (isAppStateActiveAfterBackground(this.appState, nextAppState)) {
            updateStateAfterBackgroundSwitch({ isConnectingAfterBackground: true });

            this.unsubscribeNetworkListener();
            this.unsubscribeNetworkListener = NetInfo.addEventListener(this.handleNetworkStateChange);

            setTimeout(() => {
                updateStateAfterBackgroundSwitch({ isConnectingAfterBackground: false });
            }, BROKER_RECONNECT_TIMEOUT);

            if (isAndroid) {
                BackgroundTimer.clearTimeout(this.timeout);
            } else {
                clearTimeout(this.timeout);
            }
        }
        if (isAppStateSwitchToBackground(this.appState, nextAppState)) {
            updateAppState();
        }

        if (isSetTimeoutForLogout) {
            this.setTimeoutsForLogout();
        }


        this.appState = nextAppState;
    }


    setTimeoutsForLogout = () => {
        const logout =  () => {
            this.props.logout({ withAccountSwitch: false });
        };

        if (isAndroid) {
            this.timeout = BackgroundTimer.setTimeout(logout, TIMEOUT_TO_LOGOUT);
        } else {
            this.timeout = setTimeout(logout, TIMEOUT_TO_LOGOUT);
        }
    }

    render() {
        // const {
        //     isBrokerConecting,
        //     isUserLogedIn,
        //     isUserStateInitialized,
        //     isSessionChecked,
        //     isSessionChecking
        // } = this.props;
        // const { isInitialDataLoading } = this.state;

        // const isRenderLoader  = (!isSessionChecked && !isUserStateInitialized) || isSessionChecking
        // || (isBrokerConecting && isUserLogedIn && isInitialDataLoading);


        return  (
            <AuthNavigation />
        );
    }
}

export default connect(
    state => ({
        isSessionChecking           : state.session.isSessionChecking,
        isSessionChecked            : isSessionCheckedSelector(state),
        isUserLogedIn               : isUserLogedInSelector(state),
        isUserStateInitialized      : isUserStateInitializedSelector(state),
        isBrokerConecting           : isBrokerConectionLoadingSelector(state),
        isInternetReachable         : isInternetConnectedSelector(state),
        isBrokerConnected           : isBrokerConnectedSelector(state),
        isNoConnectScreenVisible    : isNoConnectScreenVisibleSelector(state),
        isConnectingAfterBackground : isConnectingAfterBackgroundSelector(state)
    }),
    {
        ...snackbarActions,
        ...connectionActions,
        ...sessionActions,
        ...accessPoints,
        ...fetcheActions

    }
)(InitializeLayout);
