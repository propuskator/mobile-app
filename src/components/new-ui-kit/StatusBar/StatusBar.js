import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import {
    StatusBar,
    SafeAreaView
}                                   from 'react-native';

import changeNavigationBarColor     from 'react-native-navigation-bar-color';
import { withTranslation }          from 'react-i18next';

import * as themeActions            from '../../../actions/theme';
import screens                      from '../../../new-assets/constants/screens';
import colors                       from '../../../new-assets/constants/colors';
// import { isUserLogedInSelector }    from '../../../selectors/session';
import { isAndroid } from '../../../utils/platform';

const STATUSBAR_COLOR_BY_SCREEN = [ {
    screens : [
        screens.ACCESS_POINTS,
        screens.SETTINGS,
        screens.WAIT
    ],
    color           : 'STATUS_BAR',
    navigationColor : 'BACKGROUND'
}, {
    screens : [
        screens.INSTRUCTIONS,
        screens.ADD_SIRI,
        screens.INSTRUCTION
    ],
    color           : 'BACKGROUND_SECONDARY',
    navigationColor : 'BACKGROUND_SECONDARY'
}
];

const DEFAULT_COLOR = {
    color           : 'BACKGROUND',
    navigationColor : 'BACKGROUND'
};

const STATUSBAR_COLOR =  {
    'green' : 'STATUS_BAR',
    'grey'  : 'BACKGROUND_SECONDARY',
    'white' : 'BACKGROUND'
};


class Status extends PureComponent {
    static propTypes = {
        colorMode                : PropTypes.string.isRequired,
        activeRoute              : PropTypes.string.isRequired,
        color                    : PropTypes.oneOf([ 'green', 'white', 'grey' ]),
        withHeight               : PropTypes.bool,
        isNoConnectScreenVisible : PropTypes.bool.isRequired
    }

    static defaultProps = {
        color      : 'green',
        withHeight : true
    }

    getStatusBarColor = () => {
        const { colorMode, color, isNoConnectScreenVisible  } = this.props;

        if (isNoConnectScreenVisible) return colors.ERROR_LIGHT;

        return colors[colorMode][STATUSBAR_COLOR[color]];
    }

    getNavigationColor = () => {
        const { colorMode, activeRoute } = this.props;

        const  statusBarColor = STATUSBAR_COLOR_BY_SCREEN
            .find(obj => obj.screens.includes(activeRoute))
            || DEFAULT_COLOR;

        return colors[colorMode][statusBarColor?.navigationColor];
    }

    initializeNavBarTheme = () => {
        const navBarColor = this.getNavigationColor();

        changeNavigationBarColor(navBarColor);
    }

    render() {
        const { colorMode, withHeight } = this.props;
        const barBackground = this.getStatusBarColor();
        const barStyle = colorMode === 'dark'
            ? 'light-content'
            : 'dark-content';
        const statusBarHeight = StatusBar.currentHeight;
        const androidHeight = withHeight;

        return (
            <SafeAreaView
                style={{
                    backgroundColor : barBackground,
                    ...androidHeight ? { height: statusBarHeight }  : {} }}
            >
                <StatusBar
                    barStyle        = {barStyle}
                    backgroundColor = {isAndroid ? 'transparent' : barBackground}
                    height          = {statusBarHeight}
                    translucent
                />
            </SafeAreaView>
        );
    }
}


export default connect(
    state => {
        return  ({
            colorMode                : state.theme.mode,
            isThemeInitialized       : state.theme.isInitialized,
            // isUserLogedIn            : !!isUserLogedInSelector(state),
            isNoConnectScreenVisible : state.connection.isNoConnectScreenVisible
        });
    },
    { ...themeActions }
)(withTranslation()(Status));
