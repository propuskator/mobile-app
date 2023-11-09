import React, { PureComponent }                   from 'react';
import PropTypes                                  from 'prop-types';
import { connect }                                from 'react-redux';
import {
    View, Alert, Linking,
    ScrollView
}                                                 from 'react-native';
import { withTranslation }                        from 'react-i18next';

import config                                     from '../../../config';
import Button                                     from '../../new-ui-kit/Button';
import Text                                       from '../../new-ui-kit/Text';
import BorderedBlock                              from '../../new-ui-kit/BorderedBlock';
import TouchableBlock                             from '../../new-ui-kit/TouchableBlock';
import Divider                                    from '../../new-ui-kit/Divider';

import WithPageBackground                         from '../../hoc/withPageBackground';

import { LANGUAGES }                              from '../../../new-assets/constants/languages';
import screens                                    from '../../../new-assets/constants/screens';
import DefaultAvatar                              from '../../../new-assets/icons/static_icons/default_avatar.svg';

import {
    checkIsBiometrySupported,
    setBiometricPermission,
    getBiometryType
}                                                 from '../../../utils/TouchId';
import Toast                                      from '../../../utils/Toast';
import sessionManager                             from '../../../SessionManager';
import * as userActions                           from '../../../actions/users';
import * as sessionActions                        from '../../../actions/session';

import AccountsModal                              from './AccountsModal';
import style                                      from './SettingsScreenStyles';


class SettingsScreen extends PureComponent {
    static propTypes = {
        logout                 : PropTypes.func.isRequired,
        updateBiometricSetting : PropTypes.func.isRequired,
        enableBiometric        : PropTypes.func.isRequired,
        isBiometricEnable      : PropTypes.bool.isRequired,
        navigation             : PropTypes.object.isRequired,
        i18n                   : PropTypes.object.isRequired,
        t                      : PropTypes.func.isRequired,
        colorMode              : PropTypes.string.isRequired,
        toggleHigeGroups       : PropTypes.func.isRequired,
        hideGroups             : PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
        const { workspace, email, jwt, url, avatarUrl  } = sessionManager.getActiveUser();
        const sessionslist = sessionManager.getSessions();
        const isMultiUsersEnabled = sessionslist.length;

        this.state = {
            workspace,
            email,
            jwt,
            url,
            avatarUrl,
            isMultiUsersEnabled,
            isLoading           : false,
            isBiometrySupported : false,
            showAccountsModal   : false
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        const isBiometrySupported = await checkIsBiometrySupported();
        const biometryType = await getBiometryType();

        navigation.addListener('focus', this.handleUpdateState);
        navigation.addListener('blur', this.handleScreenBlur);
        this.setState({
            isBiometrySupported,
            biometryType
        });
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('focus', this.handleUpdateState);
        navigation.removeListener('blur', this.handleScreenBlur);
    }

    handleScreenBlur = () => this.handleCloseAccountsModal();

    handleUpdateState =() => {
        const { workspace, email, jwt, url, avatarUrl  } = sessionManager.getActiveUser();
        const isMultiUsersEnabled = sessionManager.isMultiUserEnabled();

        this.setState({
            workspace,
            email,
            jwt,
            url,
            avatarUrl,
            isMultiUsersEnabled
        });
    }

    handleOpenAccountsModal = () => this.setState({ showAccountsModal: true })

    handleCloseAccountsModal = () => this.setState({ showAccountsModal: false })

    handleOpenPrivacyPolicy = () => Linking.openURL(config.PRIVACY_POLICY)

    handleOpenTermsOfUse = ()  => Linking.openURL(config.TERMS_OF_USE)

    handleLogoutPress = () => {
        const { t } = this.props;
        const { email } = this.state;

        Alert.alert(
            t('Logout alert title'),
            t('Are you sure you want to log out?', { email }),
            [
                {
                    text    : t('Yes, log out'),
                    style   : 'destructive',
                    onPress : this.handleLogout
                },
                {
                    text : t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }

    handleLogout = async () => {
        this.setState({
            isLoading : true
        });
        try {
            await this.props.logout();
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    handleChangeBiometricToggle = async ({ value, onError }) => {
        const processValue = !![ true, 'true' ]?.includes(value);
        const { updateBiometricSetting, enableBiometric, t } = this.props;

        try {
            if (processValue) {
                await enableBiometric({ onError });
            } else {
                await setBiometricPermission({
                    biometricToken : '',
                    isEnable       : processValue
                });
                updateBiometricSetting({
                    isBiometricEnable : processValue
                });
            }
        } catch (err) {
            if (onError) onError();

            if (err?.name === 'LAErrorTouchIDNotEnrolled' || err?.code === 'NOT_ENROLLED') {
                const biometryType = await getBiometryType();
                const biometry = biometryType === 'TouchID' ? t('fingerprints') : t('faces');

                Alert.alert(
                    t('Error'),
                    t('enrolledError', { biometryType, biometry })
                );
            }
        }
    }

    handleNavigate = path => () => {
        const { navigation } = this.props;

        navigation.navigate(path);
    }

    handleReportPress = () => {
        const { navigation, t } = this.props;

        navigation.navigate(screens.SEND_REPORT, {
            type        : 'mobile_app',
            title       : t('Report a problem'),
            description : t('If you have any suggestions or comments for the application work - you can send us a report')
        });
    }

    handleHideGroupsToggleChange = () => {
        const { toggleHigeGroups, hideGroups } = this.props;

        toggleHigeGroups(!hideGroups);
    }

    handleShowAccountData = () => {
        const { email, url } = this.state;
        const text = ` Email: ${email} \n URL :${url}`;

        Toast.show(text, 2);
    }

    render() {
        const {
            isBiometricEnable,
            colorMode,
            i18n:{ language },
            t,
            hideGroups,
            navigation
        } = this.props;
        const {
            isLoading,
            isBiometrySupported,
            biometryType,
            workspace,
            url,
            avatarUrl,
            // isMultiUsersEnabled,
            showAccountsModal
        } = this.state;

        const languageTitle = LANGUAGES.find(lang => lang.languageTag === language)?.subTitle;
        const styles = style(colorMode);

        return (
            <WithPageBackground>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.blockWrapper} >
                        <Text
                            style            = {styles.screenTitle}
                            variant          = 'headline3'
                            allowFontScaling = {false}
                        >
                            {t('Settings')}
                        </Text>

                        <BorderedBlock containerStyle={styles.borderedBlock} withShadow>
                            <TouchableBlock
                                title         = {t('Your account')}
                                titleStyle    = {styles.accountTitle}
                                subtitle      = {workspace}
                                subtitleStyle = {styles.accountSubtitle}
                                imageUrl      = {avatarUrl ? `${url}/${avatarUrl}` : null}
                                DefaultIcon   = {!avatarUrl ? DefaultAvatar : null}
                                onClick       = {this.handleOpenAccountsModal}
                                onLongPress   = {this.handleShowAccountData}
                                // withArrow     = {isMultiUsersEnabled}
                                size          = 'L'
                            />
                        </BorderedBlock>

                        <BorderedBlock containerStyle={styles.borderedBlock} title={t('Application')} withShadow>
                            <TouchableBlock
                                title   = {t('Tags management')}
                                onClick = {this.handleNavigate(screens.ACCESS_POINTS_MANAGEMENT)}
                                size    = 'S'
                            />

                            <Divider variant='dark' />

                            <TouchableBlock
                                title   = {t('Displaying groups')}
                                onClick = {this.handleHideGroupsToggleChange}
                                value   = {!hideGroups}
                                size    = 'S'
                                withToggle
                            />

                            <Divider variant='dark' />

                            <TouchableBlock
                                title   = {t('Groups management')}
                                onClick = {this.handleNavigate(screens.GROUPS_MANAGEMENT)}
                                size    = 'S'
                            />
                        </BorderedBlock>

                        <BorderedBlock containerStyle={styles.borderedBlock} title={t('My account')} withShadow>
                            <TouchableBlock
                                title   = {t('Account settings')}
                                onClick = {this.handleNavigate(screens.ACCOUNT_SETTINGS)}
                                size    = 'S'
                            />

                            <Divider variant='dark' />

                            <TouchableBlock
                                title   = {t('Appearance')}
                                onClick = {this.handleNavigate(screens.CHANGE_THEME)}
                                size    = 'S'
                            />

                            <Divider variant='dark' />

                            {
                                isBiometrySupported
                                    ? <>
                                        <TouchableBlock
                                            title   = {biometryType}
                                            onClick = {this.handleChangeBiometricToggle}
                                            value   = {isBiometricEnable}
                                            size    = 'S'
                                            withToggle
                                        />
                                        <Divider variant='dark' />
                                    </>
                                    : null
                            }

                            <TouchableBlock
                                title   = {t('Language')}
                                value   = {languageTitle}
                                onClick = {this.handleNavigate(screens.CHANGE_LANGUAGE)}
                                size    = 'S'
                            />
                        </BorderedBlock>

                        <BorderedBlock containerStyle={styles.borderedBlock} title={t('Support')} withShadow>
                            <TouchableBlock
                                title   = {t('Report a problem')}
                                onClick = {this.handleReportPress}
                                size    = 'S'
                            />
                        </BorderedBlock>

                        <View style = {styles.privacyContainer}>
                            <Text style={styles.link} onPress={this.handleOpenPrivacyPolicy} >
                                {t('Privacy Policy')}
                            </Text>

                            <Text style={styles.linkConjunction}>{ t(' and ') }</Text>

                            <Text style={styles.link} onPress={this.handleOpenTermsOfUse} >
                                {t('Terms of Use')}
                            </Text>
                        </View>
                    </View>

                    <Button
                        title       = {t('Sign out of profile')}
                        type        = 'clear'
                        loading     = {isLoading}
                        titleStyle  = {styles.logoutBtnTitle}
                        onPress     = {this.handleLogoutPress}
                    />
                </ScrollView>
                <AccountsModal
                    isVisible  = {showAccountsModal}
                    onDismiss  = {this.handleCloseAccountsModal}
                    navigation = {navigation}
                />
            </WithPageBackground>
        );
    }
}

export default connect(
    state => ({
        isBiometricEnable : state.users.isBiometricEnable,
        colorMode         : state.theme.mode,
        hideGroups        : state.users.hideGroups
    }),
    {
        ...sessionActions,
        ...userActions
    }
)(withTranslation()(SettingsScreen));
