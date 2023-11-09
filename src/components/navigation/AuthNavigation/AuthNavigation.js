/* eslint-disable react/no-multi-comp */


import React, { PureComponent }              from 'react';
import PropTypes                             from 'prop-types';
import { connect }                           from 'react-redux';
import { withTranslation }                   from 'react-i18next';
import {
    createStackNavigator
}                                            from '@react-navigation/stack';

import Icon                                  from '../../ui-kit/Icon';
import Status                                from '../../ui-kit/Status';
import LoadingIndicator                      from '../../new-ui-kit/LoadingIndicator';
import LoginScreen                           from '../../screens/Login';
import RegistrationScreen                    from '../../screens/Register';
import RequestRegistrScreen                  from '../../screens/RequestRegister';
import IpSettings                            from '../../screens/IpSettings';
import AddToSiri                             from '../../screens/AddToSiri';
import ChangePasswordScreen                  from '../../screens/ChangePassword';
import ChangeLanguageScreen                  from '../../screens/ChangeLanguage';
import FirstStepRestorePassword              from '../../screens/RestorePassword/FirstStep';
import SecondStepRestorePassword             from '../../screens/RestorePassword/SecondStep';
import ThirdStepRestorePassword              from '../../screens/RestorePassword/ThirdStep';
import SubjectTokensScreen                   from '../../screens/SubjectTokens';
import EditInputScreen                       from '../../screens/EditInput';
import AccountSettingsScreen                 from '../../screens/AccountSettings';
import CameraStreamScreen                    from '../../screens/CameraStreamScreen';
import GroupScreen                           from '../../screens/Group';
import GroupLogoScreen                       from '../../screens/GroupLogo';
import GroupViewScreen                       from '../../screens/GroupView';
import InstructionsScreen                    from '../../screens/InstructionsScreen';
import InstructionScreen                     from '../../screens/InstructionScreen';
import WaitScreen                            from '../../screens/WaitScreen';
import SendReportScreen                      from '../../screens/SendReport';
import GroupsScreen                          from '../../screens/Groups';
import ChangeThemeScreen                     from '../../screens/ChangeTheme';

import * as connectionActions                from '../../../actions/connection';
import * as readerGroupsActions              from '../../../actions/readerGroups';

import screens                               from '../../../new-assets/constants/screens';
import colors                                from '../../../new-assets/constants/colors';

import { isAndroid, ww }                     from '../../../utils/platform';

import { isUserLogedInSelector }             from '../../../selectors/session';
import { isInternetConnectedSelector }       from '../../../selectors/connection';
import TabNavigation                         from '../TabNavigation';
import headers                               from './headers';
import style                                 from './AuthNavigationStyles';


const tabOptions = {
    headerShown : false
};

const authOptions = {
    headerShown : false
};

const INITIAL_LOAD_TIMEOUT   = 10000;

const defautlHeaderStyles = {
    shadowColor  : 'transparent',
    shadowRadius : 0,
    shadowOffset : {
        height : 0
    },
    elevation : 0
};

function stackOptions(colorMode) {
    return {
        headerTitleStyle : {
            color : colors[colorMode].TEXT_PRIMARY,
            ...isAndroid && {
                fontSize : 16
            }
        },
        headerStyle : {
            backgroundColor   : colors[colorMode].BACKGROUND,
            borderBottomColor : colors[colorMode].LINE,
            ...defautlHeaderStyles
        },
        headerBackTitleVisible : false,
        headerLeft             : props => (<Icon
            name  = 'keyboard-arrow-left'
            size  = {36}
            color = {colors[colorMode].TEXT_PRIMARY}
            {...props}
        />),
        headerTintColor : colors[colorMode].TEXT_PRIMARY,
        ...isAndroid
            ? {
                headerTitleStyle : {
                    maxWidth    : ww - 140,
                    marginLeft  : -20,
                    marginRight : 10
                }
            }
            : {
                headerLeftContainerStyle : {
                    paddingLeft : 10
                },
                headerTitleStyle : {
                    maxWidth : ww - 146,
                    color    : colors[colorMode].TEXT_PRIMARY
                }
            }
    };
}

const Stack = createStackNavigator();

// eslint-disable-next-line func-style
const cameraStreamOptions = ({ colorMode }) => {
    return ({ route }) => {
        const { accessPointTitle, accessCameraProps:{ cameraStatus } }  = route.params;
        const styles = style(colorMode);

        return {
            title                       : `Camera : ${accessPointTitle}`,
            headerTitleAllowFontScaling : false,
            // eslint-disable-next-line react/no-multi-comp
            headerRight                 : () => (
                <Status
                    style = {styles.cameraStatusWrapper}
                    state = {cameraStatus}
                    size  = 'big'
                />
            )
        };
    };
};

function routerOptions({ route }) {
    return {
        title                       : route.params.title,
        headerTitleAllowFontScaling : false
    };
}

class AuthNavigation extends PureComponent {
    static propTypes = {
        t                           : PropTypes.func.isRequired,
        colorMode                   : PropTypes.string.isRequired,
        updateTryingToConnectStatus : PropTypes.func.isRequired
        // isSessionExist              : PropTypes.bool.isRequired,
        // isInternetReachable         : PropTypes.bool.isRequired,
        // isSwitching                 : PropTypes.bool.isRequired
    }

    async componentDidMount() {
        const {  updateTryingToConnectStatus } = this.props;

        setTimeout(() => {
            updateTryingToConnectStatus({ isTryingToConnectVisible: true });
        }, INITIAL_LOAD_TIMEOUT);
    }

    render() {
        const {
            colorMode, t

        } = this.props;

        const defaultOptions = {
            headerTitleAllowFontScaling : false
        };
        const changePasswordOptions = {
            title : t('Change password'),
            ...defaultOptions
        };
        const addToSiri = {
            title       : t('Add to siri'),
            headerStyle : {
                backgroundColor : colors[colorMode].BACKGROUND_SECONDARY,
                ...defautlHeaderStyles
            },
            ...defaultOptions
        };
        const serverSettings = {
            title : t('Server settings'),
            ...defaultOptions
        };
        const restorePasswordOptions = {
            title                       : t('Password recovery'),
            headerTitleAllowFontScaling : false
        };
        const subjectTokensOptions = {
            title                       : t('Tags management'),
            headerTitleAllowFontScaling : false
        };
        const accountSettingsOptions = {
            title                       : t('Account settings'),
            headerTitleAllowFontScaling : false
        };
        const sendReportScreenOptions = {
            title                       : t('Report a problem'),
            headerTitleAllowFontScaling : false
        };
        const instructionsScreenOptions = {
            title       : isAndroid ? t('Instructions') : t('Voice assistant'),
            headerStyle : {
                backgroundColor : colors[colorMode].BACKGROUND_SECONDARY,
                ...defautlHeaderStyles
            },
            headerTitleAllowFontScaling : false
        };
        const groupsScreenOptions = {
            title                       : t('Groups management'),
            headerTitleAllowFontScaling : false
        };
        const changeThemeScreenOptions = {
            title                       : t('Appearance'),
            headerTitleAllowFontScaling : false
        };
        const languageOptions = {
            title : t('Language'),
            ...defaultOptions
        };

        return (
            <Stack.Navigator
                screenOptions    = {stackOptions(colorMode)}
                initialRouteName = {screens.LOADING}
            >
                <Stack.Screen
                    name      = {screens.LOADING}
                    component = {LoadingIndicator}
                    options   = {authOptions}
                />
                <Stack.Screen
                    name      = {screens.LOGIN}
                    component = {LoginScreen}
                    options   = {authOptions}
                />
                <Stack.Screen
                    name      = {screens.REGISTRATION}
                    component = {RegistrationScreen}
                    options   = {authOptions}
                />
                <Stack.Screen
                    name      = {screens.REQUEST_REGISTR}
                    component = {RequestRegistrScreen}
                    options   = {authOptions}
                />
                <Stack.Screen
                    name      = {screens.WAIT}
                    component = {WaitScreen}
                    options   = {authOptions}
                />
                <Stack.Screen
                    name      = {screens.IP_SETTINGS}
                    component = {IpSettings}
                    options   = {serverSettings}
                />
                <Stack.Screen
                    name      = {screens.RESTORE_PASS_FIRST}
                    component = {FirstStepRestorePassword}
                    options   = {restorePasswordOptions}
                />
                <Stack.Screen
                    name      = {screens.RESTORE_PASS_SECOND}
                    component = {SecondStepRestorePassword}
                    options   = {restorePasswordOptions}
                />
                <Stack.Screen
                    name      = {screens.RESTORE_PASS_THIRD}
                    component = {ThirdStepRestorePassword}
                    options   = {restorePasswordOptions}
                />
                <Stack.Screen
                    name      = {screens.TAB_NAVIGATION}
                    component = {TabNavigation}
                    options   = {tabOptions}
                />
                <Stack.Screen
                    name      = {screens.ADD_SIRI}
                    component = {AddToSiri}
                    options   = {addToSiri}
                />
                <Stack.Screen
                    name      = {screens.CHANGE_PASS}
                    component = {ChangePasswordScreen}
                    options   = {changePasswordOptions}
                />
                <Stack.Screen
                    name      = {screens.CHANGE_LANGUAGE}
                    component = {ChangeLanguageScreen}
                    options   = {languageOptions}
                />
                <Stack.Screen
                    name      = {screens.ACCESS_POINTS_MANAGEMENT}
                    component = {SubjectTokensScreen}
                    options   = {subjectTokensOptions}
                />
                <Stack.Screen
                    name      = {screens.CAMERA_SCREEN}
                    component = {CameraStreamScreen}
                    options   = {cameraStreamOptions({ colorMode })}
                />
                <Stack.Screen
                    name      = {screens.EDIT_INPUT}
                    component = {EditInputScreen}
                    options   = {routerOptions}
                />
                <Stack.Screen
                    name      = {screens.GROUP}
                    component = {GroupScreen}
                    options   = {headers.groupOptions(this.props)}
                />
                <Stack.Screen
                    name      = {screens.GROUP_LOGO}
                    component = {GroupLogoScreen}
                    options   = {routerOptions}
                />
                <Stack.Screen
                    name      = {screens.GROUP_VIEW}
                    component = {GroupViewScreen}
                    options   = {headers.groupViewOptions(this.props)}
                />
                <Stack.Screen
                    name      = {screens.ACCOUNT_SETTINGS}
                    component = {AccountSettingsScreen}
                    options   = {accountSettingsOptions}
                />
                <Stack.Screen
                    name      = {screens.SEND_REPORT}
                    component = {SendReportScreen}
                    options   = {sendReportScreenOptions}
                />
                <Stack.Screen
                    name      = {screens.INSTRUCTIONS}
                    component = {InstructionsScreen}
                    options   = {instructionsScreenOptions}
                />
                <Stack.Screen
                    name      = {screens.INSTRUCTION}
                    component = {InstructionScreen}
                    options   = {instructionsScreenOptions}
                />
                <Stack.Screen
                    name      = {screens.GROUPS_MANAGEMENT}
                    component = {GroupsScreen}
                    options   = {groupsScreenOptions}
                />
                <Stack.Screen
                    name      = {screens.CHANGE_THEME}
                    component = {ChangeThemeScreen}
                    options   = {changeThemeScreenOptions}
                />
            </Stack.Navigator>
        );
    }
}

export default connect(
    state => ({
        jwt                 : state.session.jwt,
        isUserLogedIn       : isUserLogedInSelector(state),
        isSessionExist      : state.session.isSessionExist,
        isSwitching         : state.users.isSwitching,
        isInternetReachable : isInternetConnectedSelector(state),
        colorMode           : state.theme.mode
    }),
    {
        ...connectionActions,
        ...readerGroupsActions
    }
)(withTranslation()(AuthNavigation));
