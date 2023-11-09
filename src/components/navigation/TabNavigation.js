import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { TouchableOpacity }         from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { withTranslation }          from 'react-i18next';
import { connect }                  from 'react-redux';

import screens                      from '../../new-assets/constants/screens';
import colors                       from '../../new-assets/constants/colors';

import AuthLayout                   from '../layouts/AuthLayout';

import AccessPoints                 from '../screens/AccessPoints';
import SettingsScreen               from '../screens/Settings';

import Icon                         from '../new-ui-kit/Icon';
import StatusBar                    from '../new-ui-kit/StatusBar';


const Tab = createBottomTabNavigator();


class TabNavigation extends PureComponent {
    static propTypes = {
        t          : PropTypes.func.isRequired,
        navigation : PropTypes.object.isRequired,
        colorMode  : PropTypes.string.isRequired
    }

    getTabBarOptions = () => {
        const { colorMode } = this.props;
        const { activeIconColor, defaultIconColor } = this.getTabsColors();

        return {
            allowFontScaling : false,
            style            : {
                height          : 55,
                backgroundColor : colors[colorMode].BACKGROUND,
                borderTopColor  : colorMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : colors[colorMode].GREY_LIGHT,
                borderTopWidth  : 1
            },
            tabStyle : {
                paddingTop    : 7,
                paddingBottom : 7
            },
            labelStyle : {
                // color      : colors[colorMode].GREY_STRONG,
                fontWeight : 'bold'
            },
            activeTintColor   : activeIconColor,
            inactiveTintColor : defaultIconColor
        };
    }


    getTabsColors = () => {
        const { colorMode } = this.props;

        return {
            activeIconColor  : colors[colorMode].PRIMARY,
            defaultIconColor : colors[colorMode].GREY_STRONG
        };
    }

    handleChangeRoute = (nextRoute) => {
        const { navigation } = this.props;

        navigation.reset({
            index  : 0,
            routes : [ { name: nextRoute } ]
        });
    }

    renderTabBarButton = (props, route) => {
        return (
            <TouchableOpacity
                {...props}
                onPress = {(e) => { // eslint-disable-line react/jsx-no-bind
                    e.preventDefault();
                    this.handleChangeRoute(route);
                }}
            />
        );
    }

    render() {
        const { colorMode, t } = this.props;
        const { activeIconColor, defaultIconColor } = this.getTabsColors();

        return (
            <AuthLayout>
                <StatusBar />
                <Tab.Navigator
                    tabBarOptions = {this.getTabBarOptions()}
                    backBehavior  = 'none'
                >
                    <Tab.Screen
                        name      = {screens.ACCESS_POINTS}
                        component = {AccessPoints}
                        options   = {{
                            tabBarLabel : t('Access points'),

                            unmountOnBlur : true,
                            tabBarButton  : (props) => {
                                return this.renderTabBarButton(props, screens.ACCESS_POINTS);
                            },
                            tabBarIcon : ({ focused }) => (
                                <Icon
                                    type  = {focused   // eslint-disable-line no-nested-ternary
                                        ? 'accessPointsActiveTab'
                                        : colorMode === 'light'
                                            ? 'accessPointsTab' : 'accessPointsTabDark'
                                    }
                                    size  = {28}
                                    color = {focused ? activeIconColor : defaultIconColor}
                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name      = {screens.SETTINGS}
                        component = {SettingsScreen}
                        options   = {{
                            tabBarLabel   : t('Settings'),
                            unmountOnBlur : true,
                            tabBarButton  : (props) => {
                                return this.renderTabBarButton(props, screens.SETTINGS);
                            },
                            tabBarIcon : ({ focused, size }) => (
                                <Icon
                                    type  = {focused ? 'settingsActiveTab' : 'settingsTab'}
                                    size  = {size}
                                    color = {focused ? activeIconColor : defaultIconColor}
                                />
                            )
                        }}
                    />
                </Tab.Navigator>
            </AuthLayout>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(TabNavigation));
