import url                         from 'url';
import React, {
    PureComponent,
    createRef
}                                  from 'react';
import PropTypes                   from 'prop-types';
import {
    View,
    Pressable,
    Keyboard,
    Linking,
    UIManager,
    LayoutAnimation
}                                  from 'react-native';
import { withTranslation }         from 'react-i18next';
// import { StackActions }            from '@react-navigation/native';
import { TouchableOpacity }       from 'react-native-gesture-handler';
import { connect }                 from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Tip }                     from 'react-native-tip';

import config                      from '../../../config';
import Icon                        from '../../new-ui-kit/Icon';
import Input                       from '../../new-ui-kit/Input';
import Button                      from '../../new-ui-kit/Button';
import InfoTip                     from '../../new-ui-kit/InfoTip';
import Checkbox                    from '../../new-ui-kit/Checkbox';
import Text                        from '../../new-ui-kit/Text';
import PasswordStrength            from '../../new-ui-kit/PasswordStrength';
import StatusBar                   from '../../new-ui-kit/StatusBar';
import sessionManager              from '../../../SessionManager';

import * as usersActions           from '../../../actions/users';
import * as linkingActions         from '../../../actions/linking';

import colors                      from '../../../new-assets/constants/colors';
import screens                     from '../../../new-assets/constants/screens';

import {
    validateRegistration,
    mapErrors
}                                  from '../../../utils/validation';
import { isAndroid, isIOS }        from '../../../utils/platform';

import { setAppUrls }              from '../../../utils/urlSettings';

import Heading                     from '../Login/Heading';

import style                       from './RegisterScreenStyles';


class RegisterScreen extends PureComponent {
    static propTypes = {
        navigation        : PropTypes.object.isRequired,
        createUserRequest : PropTypes.func.isRequired,
        // disableBiometric  : PropTypes.func.isRequired,
        t                 : PropTypes.func.isRequired,
        colorMode         : PropTypes.string.isRequired,
        route             : PropTypes.object
        // deepLinkParams    : PropTypes.object.isRequired,
        // deepLinkUrl       : PropTypes.string.isRequired,
        // setLink           : PropTypes.func.isRequired,
        // setParams         : PropTypes.func.isRequired
    }

    static defaultProps = {
        route : undefined
    };

    constructor(props) {
        super(props);
        this.initialState = {
            isPasswordHidden : {
                password        : true,
                passwordConfirm : true
            },
            initialUrl               : '',
            workspace                : '',
            email                    : '',
            password                 : '',
            passwordConfirm          : '',
            isLoading                : false,
            errors                   : {},
            withBackIcon             : false,
            isPrivacyCheckboxChecked : false
        };

        this.state = this.initialState;

        this.workspace       = createRef();
        this.email           = createRef();
        this.password        = createRef();
        this.passwordConfirm = createRef();

        this.inputs = [ this.workspace, this.email, this.password, this.passwordConfirm ];
    }


    async componentDidMount() {
        const { route: { params }, navigation } = this.props;
        const initialUrl = await Linking.getInitialURL();

        this.checkIsAuthenticated();
        Linking.addEventListener('url', this.linkingListener);
        navigation.addListener('focus', this.checkIsAuthenticated);

        if (params || initialUrl) {
            this.processDeepLink();
        }

        if (isAndroid) {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        Linking.removeListener('url', this.linkingListener);
        navigation.removeListener('focus', this.checkIsAuthenticated);
    }

    linkingListener = (linkingUrl) => {
        const queries = this._getUrlQueries(linkingUrl.url);

        this.handlefillState({ params: queries });
    }

    checkIsAuthenticated = async () => {
        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = !!activeUser?.isAuthenticated;

        this.setState({
            withBackIcon : isUserAuthenticated
        });
    }

    _getUrlQueries(link) {
        return url.parse(link, true).query;
    }

    clearState = () => {
        this.setState({ workspace: '', email: '', password: '', passwordConfirm: '' });
    }

    checkIsSubmitDisabled = () => {
        const { workspace, email, password, passwordConfirm, isPrivacyCheckboxChecked }  = this.state;
        const requiredFields = [ workspace, email, password, passwordConfirm ];

        return requiredFields?.findIndex(field => !(field || '')?.trim()?.length) > -1
            || !isPrivacyCheckboxChecked;
    }

    // processDeepLink = async () => {
    //     const { deepLinkUrl, deepLinkParams, setLink, setParams, route: { params } } = this.props;
    //     const initialUrl = await Linking.getInitialURL();
    //     const isNewLink = initialUrl && initialUrl !== deepLinkUrl;
    //     const isNewParams = params && (
    //         deepLinkParams.apiURL !== params.apiURL ||
    //         deepLinkParams.subjectEmail !== params.subjectEmail ||
    //         deepLinkParams.workspaceName !== params.workspaceName
    //     );

    //     if (isNewParams) {
    //         this.handlefillState({ params });
    //         setParams(params);
    //     } else if (isNewLink) {
    //         const queries = this._getUrlQueries(initialUrl);

    //         this.handlefillState({ params: queries });
    //         setLink(initialUrl);
    //     }
    // }


    processDeepLink = async () => {
        const {  route: { params } } = this.props;
        const initialUrl = await Linking.getInitialURL();
        // const isNewLink = initialUrl && initialUrl !== deepLinkUrl;
        // const isNewParams = params && (
        //     deepLinkParams.apiURL !== params.apiURL ||
        //     deepLinkParams.subjectEmail !== params.subjectEmail ||
        //     deepLinkParams.workspaceName !== params.workspaceName
        // );

        if (params) {
            this.handlefillState({ params });
            // setParams(params);
        } else if (initialUrl) {
            const queries = this._getUrlQueries(initialUrl);

            this.handlefillState({ params: queries });
            // setLink(initialUrl);
        }
    }

    handlefillState = ({ params }) => {
        const { subjectEmail, workspaceName, apiURL } = params;

        if (subjectEmail && workspaceName && apiURL) {
            setAppUrls(apiURL);
            this.setState({ email: subjectEmail, workspace: workspaceName });
        }
    }

    handleTogglePassword = key => () => {
        const { isPasswordHidden } = this.state;

        isPasswordHidden[key] = !isPasswordHidden[key];

        this.setState({ isPasswordHidden: { ...isPasswordHidden } });
    }

    handleInputChange = (key, value) => {
        this.setState({
            [key]  : value,
            errors : {}
        });
    }

    handleChangeToLogin =async  () => {
        const { isLoading } = this.state;
        const { navigation } = this.props;
        const initialUrl = await Linking.getInitialURL();

        if (!isLoading) {
            navigation.navigate(screens.LOGIN);

            this.clearState();
            if (initialUrl)  sessionManager.setPreviousSettings();
        }
        this.setState({
            errors : {}
        });
    }

    handleChangeSettings = () => {
        const { isLoading } = this.state;

        if (!isLoading) this.props.navigation.navigate(screens.IP_SETTINGS);
        this.setState({
            errors : {}
        });
    }

    handleOutsidePress = () => Keyboard.dismiss();

    handleRegister = async () => {
        const {
            email,
            password,
            workspace,
            passwordConfirm,
            isPrivacyCheckboxChecked,
            withBackIcon
        } = this.state;
        const isRequestBiometric = !withBackIcon;

        validateRegistration({
            data : {
                email,
                workspace,
                password,
                passwordConfirm,
                privacyPolicy : isPrivacyCheckboxChecked
            },
            onSuccess : async validData => {
                this.setState({ isLoading: true });

                await this.props.createUserRequest({
                    data      : validData,
                    isRequestBiometric,
                    onSuccess : () =>   {
                        this.setState(this.initialState);
                    },
                    onError : error => this.handleCreateError(error)
                });
            },
            onError : errors => this.handleError(errors)
        });
    }

    handleError = errors => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        this.setState({
            isLoading : false,
            errors
        });
    }

    handleCreateError = error => {
        const isServerError = error?.status === 0 && !!error?.type;

        let errors = {};

        switch (error.type) {
            case 'validation':
                errors = mapErrors(error);
                break;
            case 'forbidden':
                errors.workspace = error.message;
                break;
            default:
                if (isServerError) errors.privacyPolicy = 'Server error';
        }

        this.setState({
            isLoading : false,
            errors
        });
    }

    handleSubmitEditing = i => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else {
            if (!this.checkIsSubmitDisabled()) {
                this.handleRegister();
            }
            Keyboard.dismiss();
        }
    }

    handleCheckboxStateChange = () => {
        const { isPrivacyCheckboxChecked } = this.state;

        this.setState({
            isPrivacyCheckboxChecked : !isPrivacyCheckboxChecked
        });
    }

    handleOpenLink = openedUrl => () => {
        Linking.openURL(openedUrl);
    }

    renderPrivacyCheckbox = () => {
        const { colorMode } = this.props;
        const { isPrivacyCheckboxChecked, errors } = this.state;
        const { t } = this.props;
        const policyLink = config.PRIVACY_POLICY;
        const termsOfUseLink = config.TERMS_OF_USE;

        const styles = style(colorMode);

        const textBlock =
            (<View style={styles.checkboxTitleContainer}>
                <Text
                    style={styles.checkboxTitle}
                >
                    {t('REGISTER_CONFIRM_START')}
                    <Text
                        style={styles.checkboxLink}
                        onPress={this.handleOpenLink(policyLink)}
                    >
                        {t('Privacy Policy_register')}
                    </Text>
                    {t(' and ')}
                    <Text
                        style={styles.checkboxLink}
                        onPress={this.handleOpenLink(termsOfUseLink)}
                    >
                        {t('Terms of Use_register')}
                    </Text>
                    {t('REGISTER_CONFIRM_END')}
                </Text>
            </View>);

        const mainBlock = (
            <>
                <Pressable style={styles.checkboxWrapper} >
                    <Checkbox
                        value         = {isPrivacyCheckboxChecked}
                        onValueChange = {this.handleCheckboxStateChange}
                        colorMode     = {colorMode}
                    />
                    {textBlock}
                </Pressable>
                <Text style={styles.checkboxErrorText}>
                    {t(errors.privacyPolicy)}
                </Text>
            </>
        );

        return mainBlock;
    }

    renderPasswordStrengthChecker = () => {
        const { colorMode } = this.props;
        const { password, email } = this.state;

        if (!password.length) {
            return null;
        }

        return (
            <PasswordStrength
                password  = {password}
                email     = {email}
                colorMode = {colorMode}
            />
        );
    }

    workspaceRightIconProps = (styles) => {
        const { colorMode, t } = this.props;
        const  text = t('workspaceTip');

        return (
            <Tip
                id='help'
                body={text}
                showItemPulseAnimation
                bodyStyle={styles.tipText}
                tipContainerStyle={styles.tip}
                pulseColor='#ff8080'
            >
                <Icon
                    type  = 'questioncircle'
                    color = {colors[colorMode].PRIMARY}
                />
            </Tip>
        );
    };

    handleGoBack =() => {
        const { navigation } = this.props;

        this.setState(this.initialState);
        sessionManager.setPreviousSettings();

        navigation.goBack();

        // navigation.dispatch(
        //     StackActions.replace(screens.ACCOUNTS)
        // );
    }

    handleNavigateToRequestScreen = () => this.props.navigation.navigate(screens.REQUEST_REGISTR);

    render() {
        const { colorMode, t  } = this.props;
        const {
            isPasswordHidden,
            email,
            password,
            passwordConfirm,
            workspace,
            isLoading,
            errors,
            withBackIcon
        } = this.state;
        const styles = style(colorMode);

        return (
            <KeyboardAwareScrollView
                contentContainerStyle        = {styles.scrollStyle}
                style                        = {styles.maincontainer}
                showsVerticalScrollIndicator = {false}
                behavior                     = {isIOS ? 'padding' : 'height'}
                keyboardVerticalOffset       = {isIOS ? 10        : 5}
            >
                <StatusBar color='white' />
                <View style={styles.mainWrapper}>
                    <Pressable onPress={this.handleOutsidePress} style={styles.pressableWrapper}>
                        <View style = {styles.container}>
                            <Heading
                                withBackIcon    = {withBackIcon}
                                onGoBack        = {this.handleGoBack}
                                onSettingsClick = {this.handleChangeSettings}
                                colorMode       = {colorMode}
                            />
                            <View style = {styles.wrapper}>
                                <View style = {styles.inputsWrapper}>
                                    <Input
                                        ref             = {this.workspace}
                                        disabled        = {isLoading}
                                        label           = {t('Workspace')}
                                        placeholder     = {t('Enter your workspace')}
                                        name            = {'workspace'}
                                        value           = {workspace}
                                        onChange        = {this.handleInputChange}
                                        errorMessage    = {errors.workspace}
                                        returnKeyType   = 'next'
                                        blurOnSubmit    = {false}
                                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 0)}
                                        colorMode       = {colorMode}
                                        autoCapitalize  = 'none'
                                        rightIcon       = {<InfoTip id='registr_help' containerStyle={styles.infoTip} />}
                                    />
                                    <Input
                                        ref             = {this.email}
                                        keyboardType    = 'email-address'
                                        disabled        = {isLoading}
                                        label           = {t('Email')}
                                        placeholder     = {t('Enter your email')}
                                        name            = {'email'}
                                        value           = {email}
                                        onChange        = {this.handleInputChange}
                                        errorMessage    = {errors.email}
                                        returnKeyType   = 'next'
                                        blurOnSubmit    = {false}
                                        autoCapitalize  = 'none'
                                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 1)}
                                        colorMode       = {colorMode}
                                    />
                                    <Input
                                        ref             = {this.password}
                                        disabled        = {isLoading}
                                        label           = {t('Password')}
                                        subLabel        = {t('minimum 6 symbols')}
                                        placeholder     = {t('Enter your password')}
                                        secureTextEntry = {isPasswordHidden.password}
                                        name            = {'password'}
                                        value           = {password}
                                        onChange        = {this.handleInputChange}
                                        errorMessage    = {errors.password}
                                        returnKeyType   = 'next'
                                        blurOnSubmit    = {false}
                                        autoCapitalize  = 'none'
                                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 2)}
                                        colorMode       = {colorMode}
                                        rightIcon       = {{
                                            name    : isPasswordHidden.password ? 'eye-outline' : 'eye-off-outline',
                                            type    : 'material-community',
                                            color   : colors[colorMode].PRIMARY,
                                            size    : 28,
                                            onPress : this.handleTogglePassword('password')
                                        }}
                                    />

                                    {this.renderPasswordStrengthChecker()}

                                    <Input
                                        ref             = {this.passwordConfirm}
                                        disabled        = {isLoading}
                                        label           = {t('Confirm password')}
                                        placeholder     = {t('Confirm your password')}
                                        secureTextEntry = {isPasswordHidden.passwordConfirm}
                                        name            = {'passwordConfirm'}
                                        value           = {passwordConfirm}
                                        onChange        = {this.handleInputChange}
                                        errorMessage    = {errors.passwordConfirm}
                                        returnKeyType   = 'go'
                                        blurOnSubmit    = {false}
                                        colorMode       = {colorMode}
                                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 3)}
                                        rightIcon       = {{
                                            name    : isPasswordHidden.passwordConfirm ? 'eye-outline' : 'eye-off-outline',
                                            type    : 'material-community',
                                            color   : colors[colorMode].PRIMARY,
                                            size    : 30,
                                            onPress : this.handleTogglePassword('passwordConfirm')
                                        }}
                                    />
                                    {this.renderPrivacyCheckbox()}
                                </View>
                            </View>
                        </View>

                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity  onPress = {this.handleNavigateToRequestScreen}>
                                <Text style={styles.requestLink}>
                                    {t('Send a workspace registration request')}
                                </Text>
                            </TouchableOpacity>
                            <Button
                                title      = {t('Register')}
                                onPress    = {this.handleRegister}
                                loading    = {isLoading}
                                isDisabled = {this.checkIsSubmitDisabled()}
                            />
                        </View>
                        <View style = {styles.registerContainer}>
                            <TouchableOpacity
                                style   = {styles.registerBtnContainer}
                                onPress = {this.handleChangeToLogin}
                            >
                                <Text style = {styles.registerDescription}>
                                    {t('Already registered?')}
                                </Text>
                                <Text style = {styles.registerTitle}>
                                    {t('Sign in')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

export default connect(
    state => ({
        colorMode      : state.theme.mode,
        deepLinkUrl    : state.linking.deepLinkUrl,
        deepLinkParams : state.linking.deepLinkParams
    }),
    {
        ...usersActions,
        ...linkingActions
    }
)(withTranslation()(RegisterScreen));
