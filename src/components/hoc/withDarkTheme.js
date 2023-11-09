import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import {
    SafeAreaView
    // Appearance
}                                   from 'react-native';
import changeNavigationBarColor     from 'react-native-navigation-bar-color';
import { ThemeProvider }            from 'react-native-elements';

import * as themeActions            from '../../actions/theme';
import { getThemeValueFromStorage } from '../../utils/storage/settingsHelper';

import screens                      from '../../new-assets/constants/screens';
// import modals                       from '../../new-assets/constants/modals';

import theme                        from '../../new-assets/constants/theme-components';
import colors                       from '../../new-assets/constants/colors';
import { isUserLogedInSelector }    from '../../selectors/session';


const STATUSBAR_COLOR_BY_SCREEN = [ {
    screens : [
        screens.ACCESS_POINTS,
        screens.SETTINGS
        // modals.NOTIFICATIONS,
        // modals.NOTIFICATION_SETTINGS
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


class withDarkTheme extends PureComponent {
    static propTypes = {
        children            : PropTypes.object.isRequired,
        updateThemeValue    : PropTypes.func.isRequired,
        initializeThemeMode : PropTypes.func.isRequired,
        // updateAppearanceValue : PropTypes.func.isRequired,
        colorMode           : PropTypes.string.isRequired,
        isThemeInitialized  : PropTypes.bool.isRequired,
        activeRoute         : PropTypes.string.isRequired
        // updateColorModeValue  : PropTypes.func.isRequired,
        // isSystemTheme         : PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.initializeTheme();
        // this.initializeDeviceAppearance();
        this.initializeNavBarTheme();

        // Appearance.addChangeListener(this.initializeDeviceAppearance);
    }

    componentDidUpdate(prevProps) {
        const prevColorMode = prevProps.colorMode;
        const { colorMode } = this.props;
        const isColorModeChanged = prevColorMode !== colorMode;

        if (isColorModeChanged) {
            this.initializeNavBarTheme();
        }
    }

    // componentWillUnmount() {
    //     Appearance.removeChangeListener(this.initializeDeviceAppearance);
    // }

    initializeTheme = async () => {
        const { updateThemeValue, initializeThemeMode } = this.props;
        const themeMode = await getThemeValueFromStorage() || 'light';
        //    const currentThemeMode = storageThemeMode || 'light';

        updateThemeValue(themeMode);
        initializeThemeMode();
    };

    // initializeDeviceAppearance = () => {
    //     const { updateAppearanceValue /* , isSystemTheme */ } = this.props;
    //     const deviceColorScheme = Appearance.getColorScheme();

    //     // if (isSystemTheme) updateColorModeValue(deviceColorScheme);
    //     updateAppearanceValue(deviceColorScheme);
    // }

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
        const { children, isThemeInitialized, colorMode } = this.props;
        const navBarColor = this.getNavigationColor();

        const uiTheme = theme(colorMode);

        if (!isThemeInitialized) return null;

        return (
            <ThemeProvider theme={uiTheme}>
                {children}
                <SafeAreaView style={{ backgroundColor: navBarColor }} />
            </ThemeProvider>
        );
    }
}

export default connect(
    state => ({
        colorMode          : state.theme.mode,
        isThemeInitialized : state.theme.isInitialized,
        isUserLogedIn      : !!isUserLogedInSelector(state)
        // isSystemTheme      : state.theme.isSystem,
        // isTryingToConnectVisible : isTryingToConnectVisibleSelector(state)
    }),
    { ...themeActions }
)(withDarkTheme);
