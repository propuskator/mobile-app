import url                         from 'url';
import React, {
    PureComponent,
    createRef }                    from 'react';

import PropTypes                   from 'prop-types';
import {
    KeyboardAvoidingView,
    View,
    Pressable,
    Keyboard,
    Linking,
    TouchableOpacity
}                                  from 'react-native';
import { connect }                 from 'react-redux';
import { withTranslation }         from 'react-i18next';
import {
    NavigationContext
}                                  from '@react-navigation/native';

import Input                       from '../../new-ui-kit/Input';
import Button                      from '../../new-ui-kit/Button';
import InfoTip                     from '../../new-ui-kit/InfoTip';
import Text                        from '../../new-ui-kit/Text';
import Icon                        from '../../new-ui-kit/Icon';
import StatusBar                   from '../../new-ui-kit/StatusBar';

import sessionManager              from '../../../SessionManager';

import screens                     from '../../../new-assets/constants/screens';
import colors                      from '../../../new-assets/constants/colors';
import * as userActions            from '../../../actions/users';
import * as sessionActions         from '../../../actions/session';
import * as connectionActions      from '../../../actions/connection';

import {
    validateCreateSession,
    mapErrors }                    from '../../../utils/validation';
import { isIOS }                   from '../../../utils/platform';
import * as NavigationHelper       from '../../../utils/NavigationHelper';
import {
    checkIsBiometrySupported,
    getBiometryType
}                                  from '../../../utils/TouchId';
import { setAppUrls }              from '../../../utils/urlSettings';

import Heading                     from './Heading';
import style                       from './LoginScreenStyles';


class LoginScreen extends PureComponent {
    static propTypes = {
        navigation                : PropTypes.object.isRequired,
        loginRequest              : PropTypes.func.isRequired,
        checkSession              : PropTypes.func.isRequired,
        isBiometricEnable         : PropTypes.bool.isRequired,
        t                         : PropTypes.func.isRequired,
        colorMode                 : PropTypes.string.isRequired,
        route                     : PropTypes.object.isRequired,
        isSessionCreating         : PropTypes.bool.isRequired,
        checkSessionForUserSwitch : PropTypes.func.isRequired
    }
    static contextType = NavigationContext;


    constructor(props) {
        super(props);
        this.initialState = {
            isPasswordHidden : true,
            workspace        : '',
            storageWorkspace : '',
            email            : '',
            storageEmail     : '',
            password         : '',
            user             : {},
            isLoading        : false,
            errors           : {},
            isFocused        : false
        };

        this.state = this.initialState;
        //  NavigationHelper.initRootNavigator(props.navigation);

        this.workspace       = createRef();
        this.email           = createRef();
        this.password        = createRef();
        this.inputs = [ this.workspace, this.email, this.password ];
    }

    async componentDidMount() {
        const { navigation } = this.props;

        this.fillState();
        Linking.addEventListener('url', this.linkingListener);

        navigation.addListener('focus', this.fillState);
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        Linking.removeListener('url', this.linkingListener);

        navigation.removeListener('focus', this.fillState);
    }

    linkingListener = (linkingUrl) => {
        const queries = this._getUrlQueries(linkingUrl.url);

        this.handlefillStateFromDeepLink({ params: queries });
    }

    _getUrlQueries(link) {
        return url.parse(link, true).query;
    }

    fillState = async () => {
        const { route : { params } } = this.props;
        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = activeUser?.isAuthenticated;
        const isBiometrySupported = await checkIsBiometrySupported();
        const biometryType = isBiometrySupported ? await getBiometryType() : void 0;

        this.setState({
            withBackIcon : isUserAuthenticated,
            isBiometrySupported,
            biometryType
        });

        if (!isUserAuthenticated) {
            this.setDataFromStorage();
        }

        if (params?.fields) {
            const user = params?.fields?.user || {};

            this.setState({
                ...user
                    ? {
                        user,
                        email            : user.email,
                        workspace        : user.workspace,
                        storageWorkspace : user.workspace,
                        storageEmail     : user.email
                    }
                    : {}

            });
        }

        const isParamsFromDeepLink = params?.workspaceName;

        if (isParamsFromDeepLink) this.handlefillStateFromDeepLink({ params });
    }


    linkingListener = (linkingUrl) => {
        const queries = this._getUrlQueries(linkingUrl.url);

        this.handlefillStateFromDeepLink({ params: queries });
    }


    processDeepLink = async () => {
        const {  route: { params } } = this.props;
        const initialUrl = await Linking.getInitialURL();

        const isParamsFromDeepLink = params?.workspaceName;

        if (initialUrl) this.linkingListener(initialUrl);
        else if (isParamsFromDeepLink) {
            this.handlefillStateFromDeepLink({ params });
        }
    }

    checkIsSubmitDisabled = () => {
        const { workspace, email, password }  = this.state;
        const requiredFields = [ workspace, email, password ];

        return requiredFields?.findIndex(field => !field?.trim()?.length) > -1;
    }

    handlefillStateFromDeepLink = ({ params }) => {
        const { email, workspaceName, apiURL } = params;

        console.log(apiURL);
        console.log(workspaceName, email);
        if (email && workspaceName && apiURL) {
            setAppUrls(apiURL);
            this.setState({
                ...email ?  { email } : {},
                ...workspaceName ?  { workspace: workspaceName } : {}
            });
        }
    }

    handleTogglePassword = () => {
        this.setState(prev => ({ ...prev, isPasswordHidden: !prev.isPasswordHidden }));
    }

    handleInputChange = (key, value) => {
        this.setState({
            [key]  : value,
            errors : {}
        });
    }

    setDataFromStorage = async () => {
        const { workspace, email } =  sessionManager.getActiveUser();

        this.setState({
            ...workspace ? {
                storageWorkspace : workspace,
                workspace
            } : {},
            ... email ? {
                email,
                storageEmail : email
            } : {}
        });
    }


    handleLogin = async () => {
        const { email, workspace, password, storageWorkspace, storageEmail, withBackIcon } = this.state;
        const isStorageDataCompareInput = storageWorkspace === workspace && storageEmail === email;

        const isRequestBiometric =  !isStorageDataCompareInput && !withBackIcon;

        validateCreateSession({
            data : {
                workspace,
                email,
                password
            },
            onSuccess : async validData => {
                await this.props.loginRequest({
                    data    : validData,
                    isRequestBiometric,
                    onError : error => this.handleLoginError(error)
                });


                this.setState(this.initialState);
            },
            onError : errors => this.handleError(errors)
        });
    }

    handleError = errors => this.setState({ errors });

    handleLoginError = error => {
        const { navigation, t } = this.props;

        const isServerError = error?.status === 0 && !!error?.type;

        let errors = {};
        const { type, code } = error;

        switch (type) {
            case 'validation':
                if (code === 'REGISTRATION_REQUEST_IN_PROCESSING') navigation.navigate(screens.WAIT);
                errors = mapErrors(error);
                break;

            case 'forbidden':
                errors.workspace = error.message;
                break;

            default:
                if (isServerError) errors.password = 'Server error';
        }

        const isWrongCredentials = code === 'WRONG_EMAIL_OR_PASSWORD';

        if (isWrongCredentials) {
            errors.email = t('Wrong email or password');
            errors.password = ' ';
        }

        this.setState({ errors });
    }

    handleChangeToRegister = async () => {
        const { navigation, route:{ params }, isSessionCreating } = this.props;

        if (!isSessionCreating) navigation.navigate(screens.REGISTRATION, params);
        this.setState({
            errors : {}
        });
    }

    handleKeyboardClose = () => {
        this.setState({ isFocused: false });

        Keyboard.dismiss();
    }

    handleChangeSettings = () => {
        const { isSessionCreating, route:{ params }  } = this.props;
        const user  = params?.fields?.user;

        if (!isSessionCreating) {
            this.props.navigation.navigate({
                name   : screens.IP_SETTINGS,
                params : { user }
            });
        }
        this.setState({
            errors : {}
        });
    }

    handleSubmitEditing = i  => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else {
            if (!this.checkIsSubmitDisabled()) {
                this.handleLogin();
            }
            this.handleKeyboardClose();
        }
    }

    handleTriggerBiometric = async () => {
        const { checkSession, checkSessionForUserSwitch } = this.props;
        const { user } = this.state;

        if (user.jwt) await checkSessionForUserSwitch(user);
        else await checkSession();
    }

    handleOutsidePress =() => {
        this.handleKeyboardClose();
    }

    handleFocused = () => {
        this.setState({ isFocused: true });
    }

    renderRestorePassButton = () => {
        const { t, colorMode } = this.props;
        const styles = style(colorMode);
        const { email, workspace, storageWorkspace, storageEmail } = this.state;

        return (
            <View style={styles.restorePassContainer}>
                <TouchableOpacity
                    style   = {styles.restorePassButton}
                    onPress = {this.handleNavigate(
                        screens.RESTORE_PASS_FIRST,
                        {
                            email     : email || storageEmail,
                            workspace : workspace || storageWorkspace
                        }
                    )}
                >
                    <Text style={styles.restorePassText}>{t('Forgot password?')}</Text>
                </TouchableOpacity>
            </View>
        );
    }


    handleNavigate = (path, params = null) => () => {
        const { navigation } = this.props;

        if (params) {
            navigation.navigate({
                name : path,
                params
            });
        } else {
            navigation.navigate(path);
        }
    }

    handleShowTip = () => {
        console.log('handleShowTip');
    }

    handleGoBack =() => {
        this.setState(this.initialState);
        sessionManager.setPreviousSettings();

        NavigationHelper.navigate(
            screens.TAB_NAVIGATION,
            { screen: screens.SETTINGS }
        );
    }

    render() {
        const {  email, password, workspace,
            errors, isPasswordHidden, isFocused,
            storageWorkspace, storageEmail,
            withBackIcon,
            isBiometrySupported, biometryType
        } = this.state;

        const { isBiometricEnable, isSessionCreating, colorMode, t } = this.props;
        const isStorageDataCompareInput = storageWorkspace === workspace
            && storageEmail.toLowerCase() === email.toLowerCase();

        const isAllowBiometric = isBiometricEnable &&  isStorageDataCompareInput && email && isBiometrySupported;
        const styles = style(colorMode);

        return (
            <Pressable onPress={this.handleKeyboardClose} style={styles.pressableWrapper}>
                <StatusBar color='white' />
                <KeyboardAvoidingView
                    style                  = {[ styles.container ]}
                    behavior               = {isIOS ? 'padding' : 'height'}
                    keyboardVerticalOffset = {isIOS ? 10 : 5}
                >
                    <View
                        keyboardDismissMode       = 'none'
                        keyboardShouldPersistTaps = 'never'
                        style                     = {styles.contentContainer}
                        contentContainerStyle     = {[ styles.contentContainer ]}
                    >
                        <Heading
                            withBackIcon    = {withBackIcon}
                            onGoBack        = {this.handleGoBack}
                            onSettingsClick = {this.handleChangeSettings}
                            colorMode       = {colorMode}
                        />
                        <View style = {[ styles.wrapper, isFocused && styles.focused ]}>
                            <View style = {styles.inputsWrapper}>
                                <Input
                                    ref             = {this.workspace}
                                    disabled        = {isSessionCreating}
                                    label           = {t('Workspace')}
                                    onFocus         = {this.handleFocused}
                                    placeholder     = {t('Workspace name')}
                                    name            = {'workspace'}
                                    value           = {workspace}
                                    onChange        = {this.handleInputChange}
                                    errorMessage    = {errors.workspace}
                                    returnKeyType   = 'next'
                                    blurOnSubmit    = {false}
                                    colorMode       = {colorMode}
                                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 0)}
                                    rightIcon       = {<InfoTip id='login_help' containerStyle={styles.infoTip} />}
                                    autoCapitalize  = 'none'
                                />
                                <Input
                                    ref             = {this.email}
                                    onFocus         = {this.handleFocused}
                                    disabled        = {isSessionCreating}
                                    label           = {t('Email')}
                                    placeholder     = {t('Enter your email')}
                                    name            = {'email'}
                                    value           = {email}
                                    onChange        = {this.handleInputChange}
                                    errorMessage    = {errors.email}
                                    keyboardType    = 'email-address'
                                    returnKeyType   = 'next'
                                    blurOnSubmit    = {false}
                                    colorMode       = {colorMode}
                                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 1)}
                                    autoCapitalize  = 'none'
                                />
                                <Input
                                    ref             = {this.password}
                                    onFocus         = {this.handleFocused}
                                    disabled        = {isSessionCreating}
                                    label           = {t('Password')}
                                    placeholder     = {t('Enter your password')}
                                    secureTextEntry = {isPasswordHidden}
                                    name            = {'password'}
                                    value           = {password}
                                    onChange        = {this.handleInputChange}
                                    errorMessage    = {t(errors.password)}
                                    containerStyle  = {styles.lastInputContainer}
                                    autoCapitalize  = 'none'
                                    rightIcon       = {{
                                        name    : isPasswordHidden ? 'eye-outline' : 'eye-off-outline',
                                        type    : 'material-community',
                                        color   : colors[colorMode].PRIMARY,
                                        size    : 28,
                                        onPress : this.handleTogglePassword
                                    }}
                                    returnKeyType   = 'go'
                                    blurOnSubmit    = {false}
                                    colorMode       = {colorMode}
                                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 2)}
                                />
                                {this.renderRestorePassButton()}
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.footer}>
                    { isAllowBiometric
                        ? (
                            <TouchableOpacity style={styles.biometricBlock} onPress={this.handleTriggerBiometric}>
                                <View style={styles.biometricIcon}>
                                    <Icon
                                        type  = {biometryType === 'FaceID' ? 'faceId' : 'touchId'}
                                        size  = {43}
                                        color = {colors[colorMode].PRIMARY}
                                    />
                                </View>
                                <Text style={styles.biometricTitle}>
                                    {biometryType === 'FaceID' ? t('Login with Face ID') : t('Login with Touch ID')}
                                </Text>
                            </TouchableOpacity>
                        ) : null
                    }
                    <View style={styles.buttonWrapper}>
                        <Button
                            title      = {t('Sign in')}
                            onPress    = {this.handleLogin}
                            loading    = {isSessionCreating}
                            isDisabled = {this.checkIsSubmitDisabled()}
                        />
                    </View>
                    <View style={styles.registerContainer}>
                        <TouchableOpacity
                            style   = {styles.registerBtnContainer}
                            onPress = {this.handleChangeToRegister}
                        >
                            <Text style={styles.registerDescription}>
                                {t('Not registered yet?')}
                            </Text>
                            <Text style={styles.registerTitle}>
                                {t('Register')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        );
    }
}

export default connect(
    state => ({
        isBiometricEnable        : state.users.isBiometricEnable,
        colorMode                : state.theme.mode,
        isNavigatedToLoginLayout : state.session.isNavigatedToLoginLayout,
        isSessionCreating        : state.session.isSessionCreating
    }),
    {
        ...userActions,
        ...sessionActions,
        ...connectionActions
    }
)(withTranslation()(LoginScreen));
