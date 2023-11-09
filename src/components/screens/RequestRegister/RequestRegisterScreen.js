import React, {
    PureComponent
}                                  from 'react';
import PropTypes                   from 'prop-types';
import {
    View,
    Linking,
    UIManager,
    LayoutAnimation,
    Keyboard
}                                  from 'react-native';
import { withTranslation }         from 'react-i18next';
import { ScrollView }              from 'react-native-gesture-handler';
// import { StackActions }            from '@react-navigation/native';
import { connect }                 from 'react-redux';


import Button                      from '../../new-ui-kit/Button';
import Stepper                     from '../../new-ui-kit/Stepper';
// import KeyboardAwareScroll         from '../../new-ui-kit/KeyboardAwareScroll';
import StatusBar                   from '../../new-ui-kit/StatusBar';

import sessionManager              from '../../../SessionManager';

import * as usersActions           from '../../../actions/users';
import * as linkingActions         from '../../../actions/linking';

import screens                     from '../../../new-assets/constants/screens';

import {
    validateRegistrationRequest,
    validateCredentials,
    validateWorkspace,
    mapErrors
}                                  from '../../../utils/validation';
import { isAndroid }               from '../../../utils/platform';
import { setAppUrls }              from '../../../utils/urlSettings';

import Heading                     from '../Login/Heading';

import FirstStep                   from './FirstStep';
import SecondStep                  from './SecondStep';
import ThirdStep                   from './ThirdStep';

import style                       from './RequestRegisterScreenStyles';


const STEPS_KEYS = {
    FIRST  : 'workspace',
    SECOND : 'credentials',
    THIRD  : 'basic'
};

const STEPS_LIST = [
    {
        name      : STEPS_KEYS?.FIRST,
        component : FirstStep,
        validate  : validateWorkspace
    }, {
        name      : STEPS_KEYS?.SECOND,
        component : SecondStep,
        validate  : validateCredentials
    }, {
        name      : STEPS_KEYS?.THIRD,
        component : ThirdStep,
        validate  : validateRegistrationRequest
    }
];


class RegisterScreen extends PureComponent {
    static propTypes = {
        navigation                : PropTypes.object.isRequired,
        t                         : PropTypes.func.isRequired,
        colorMode                 : PropTypes.string.isRequired,
        route                     : PropTypes.object,
        createRegistrationRequest : PropTypes.func.isRequired
    }

    static defaultProps = {
        route : undefined
    };

    constructor(props) {
        super(props);

        const {
            workspaceName = '', subjectEmail = '', password = '', passwordConfirm = ''
        } = props?.route?.params || {};

        this.initialState = {
            activeStep       : STEPS_KEYS?.FIRST,
            isPasswordHidden : {
                password        : true,
                passwordConfirm : true
            },
            initialUrl               : '',
            workspace                : workspaceName || '',
            email                    : subjectEmail || '',
            password                 : password || '',
            passwordConfirm          : passwordConfirm || '',
            phone                    : '',
            subjectName              : '',
            isLoading                : false,
            errors                   : {},
            isPrivacyCheckboxChecked : false
        };

        this.state = this.initialState;
        this.isCloseScreen = false;
    }


    async componentDidMount() {
        const { route: { params }, navigation } = this.props;
        const initialUrl = await Linking.getInitialURL();

        navigation.addListener('beforeRemove', this.goBackListener);

        Linking.addEventListener('url', this.linkingListener);

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

        navigation.removeListener('beforeRemove', this.goBackListener);
    }

    goBackListener = (e) => {
        if (!this.isCloseScreen) {
            e.preventDefault();
            this.handleGoBack();
        }
    }

    getStepIndex = (activeStep) => STEPS_LIST?.findIndex(step => step?.name === activeStep);

    clearState = () => {
        this.setState({ workspace: '', email: '', password: '', passwordConfirm: '', phone: '', subjectName: '' });
    }

    checkIsSubmitDisabled = () => {
        const {
            workspace,
            email, password, passwordConfirm,
            subjectName, isPrivacyCheckboxChecked,
            activeStep, errors, isLoading
        }  = this.state;

        if (isLoading) return true;

        const errorKeys = [
            'workspace',
            'email', 'password', 'passwordConfirm',
            'phone', 'subjectName', 'privacyPolicy'
        ];
        const isErrorExist = !!errorKeys?.find(key => !!errors[key]);

        if (isErrorExist) return true;

        const REQUIRED_FIELDS_BY_STEP = {
            [STEPS_KEYS?.FIRST]  : [ workspace ],
            [STEPS_KEYS?.SECOND] : [
                email, password, passwordConfirm
            ],
            [STEPS_KEYS?.THIRD] : [
                subjectName, isPrivacyCheckboxChecked ? 'true' : ''
            ]
        };

        const requiredFields = REQUIRED_FIELDS_BY_STEP[activeStep] || [];

        return requiredFields?.findIndex(field => !(field || '')?.trim()?.length) > -1
            || requiredFields?.find(field => !(field || '')?.trim()?.length) > -1;
    }

    checkIsLastStep = (stepIndex) => stepIndex === STEPS_LIST?.length - 1;

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

    handleChangeSettings = () => {
        const { isLoading, apiURL } = this.state;

        if (!isLoading) {
            this.props.navigation.navigate(
                screens.IP_SETTINGS,
                apiURL ? {
                    user   : { url: apiURL },
                    onSave : () => this.setState({ apiURL: null })
                } : {},
            );
        }
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
            subjectName,
            phone,
            apiURL
        } = this.state;

        const { navigation } = this.props;

        validateRegistrationRequest({
            data : {
                email,
                workspace,
                subjectName,
                phone,
                password,
                passwordConfirm,
                privacyPolicy : isPrivacyCheckboxChecked
            },
            onSuccess : async validData => {
                this.setState({ isLoading: true });
                if (apiURL) await setAppUrls(apiURL);

                this.props.createRegistrationRequest({
                    data      : validData,
                    onSuccess : () =>   {
                        this.setState(this.initialState);
                        navigation.navigate(screens.WAIT);
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

        switch (error?.type) {
            case 'validation':
                errors = mapErrors(error);
                break;
            case 'forbidden':
                errors.workspace = error?.message;
                break;
            default:
                if (isServerError) errors.privacyPolicy = 'Server error';
        }

        const isFirstTabError = errors?.workspace;
        const isSecondTabError = errors?.email || errors?.password || errors?.passwordConfirm;

        this.setState({
            isLoading : false,
            errors,
            ...(isSecondTabError ? { activeStep: STEPS_KEYS?.SECOND } : {}),
            ...(isFirstTabError ? { activeStep: STEPS_KEYS?.FIRST } : {})

        });
    }

    handleCheckboxStateChange = ({ name } = {}) => {
        this.setState({ [name]: !this.state[name] });
    }

    handleCloseScreen =() => {
        const { navigation } = this.props;

        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = activeUser?.isAuthenticated;

        this.setState(this.initialState);

        this.isCloseScreen = true;

        try {
            if (isUserAuthenticated)  {
                sessionManager.setPreviousSettings();
                navigation.goBack();
            } else  {
                navigation.navigate(screens.REGISTRATION);
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleGoBack =() => {
        const activeStepIndex = this.getStepIndex(this.state.activeStep);

        if (activeStepIndex === 0) return this.handleCloseScreen();
        this.handleGoPrevStep({ nextIndex: activeStepIndex - 1 });
    }

    handleGoPrevStep = ({ nextIndex } = {}) => {
        const nextStep = STEPS_LIST[nextIndex]?.name;

        if (!nextStep) return;

        this.setState({ activeStep: nextStep, errors: {} });
    }

    handleGoNext = () => {
        if (this.state?.isLoading) return;

        if (this.checkIsSubmitDisabled()) return;

        const activeStepIndex = this.getStepIndex(this.state.activeStep);
        const activeStepData = STEPS_LIST[activeStepIndex];


        this.validateStepData({
            handler   : activeStepData?.validate,
            onSuccess : (validData) => {
                const isLastStep = this.checkIsLastStep(activeStepIndex);

                if (isLastStep) return this.handleRegister(validData);

                const nextIndex = isLastStep ? 0 : activeStepIndex + 1;
                const nextStep = STEPS_LIST[nextIndex]?.name;

                if (nextStep) this.setState({ activeStep: nextStep });
            }
        });
    }

    validateStepData = ({ handler, onSuccess } = {}) => {
        const {
            email,
            password,
            workspace,
            passwordConfirm,
            isPrivacyCheckboxChecked,
            subjectName,
            phone
            // apiURL
        } = this.state;
        const formData = {
            email,
            workspace,
            subjectName,
            phone,
            password,
            passwordConfirm,
            privacyPolicy : isPrivacyCheckboxChecked
        };

        if (!handler) return onSuccess(formData);

        handler({
            data    : formData,
            onSuccess,
            onError : errors => this.handleError(errors)
        });
    }

    handleRegister = async (validData) => {
        const { navigation, createRegistrationRequest } = this.props;
        const { apiURL } = this.state;

        this.setState({ isLoading: true });
        if (apiURL) await setAppUrls(apiURL);

        await createRegistrationRequest({
            data      : validData,
            onSuccess : () =>   {
                this.setState(this.initialState);
                navigation.navigate(screens.WAIT);
            },
            onError : error => this.handleCreateError(error)
        });
    }

    checkIsAuthenticated = async () => {
        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = activeUser?.isAuthenticated;

        this.setState({
            withBackIcon : isUserAuthenticated
        });
    }

    render() {
        const { colorMode, t  } = this.props;
        const {
            isPasswordHidden,
            email,
            password,
            passwordConfirm,
            workspace,
            isPrivacyCheckboxChecked,
            phone,
            subjectName,
            isLoading,
            errors,
            activeStep
        } = this.state;
        const styles = style(colorMode);

        const StepComponent = STEPS_LIST?.find(step => step?.name === activeStep)?.component;

        const activeStepIndex = this.getStepIndex(activeStep);
        const isLastStep = this.checkIsLastStep(activeStepIndex);

        return (
            <View style={styles.container}>
                <StatusBar color='white' />
                <View style={styles.headingContainer}>
                    <Heading
                        withBackIcon
                        onGoBack        = {this.handleGoBack}
                        onSettingsClick = {this.handleChangeSettings}
                        colorMode       = {colorMode}
                    />
                </View>

                <Stepper
                    steps        = {STEPS_LIST?.map(step => step?.name)}
                    currStep     = {activeStep}
                    stepperStyle = {styles.stepperContainer}
                />
                {/*
                    <KeyboardAwareScroll
                        contentContainerStyle = {styles.contentContainer}
                        style                 = {styles.container}
                    >
                */}
                <View
                    style = {styles.contentContainer}
                >
                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle = {styles.inputsWrapper}
                        >
                            { StepComponent
                                ? (
                                    <StepComponent
                                        onTogglePassword         = {this.handleTogglePassword}
                                        email                    = {email}
                                        password                 = {password}
                                        passwordConfirm          = {passwordConfirm}
                                        workspace                = {workspace}
                                        phone                    = {phone}
                                        subjectName              = {subjectName}
                                        isPrivacyCheckboxChecked = {isPrivacyCheckboxChecked}
                                        isLoading                = {isLoading}
                                        isPasswordHidden         = {isPasswordHidden}
                                        errors                   = {errors}
                                        onInputChange            = {this.handleInputChange}
                                        onCheckboxChange         = {this.handleCheckboxStateChange}
                                    />
                                ) : null
                            }
                        </ScrollView>

                        <View style = {styles.footer}>
                            <Button
                                title      = {isLastStep ? t('Send request') : t('Continue')}
                                onPress    = {this.handleGoNext}
                                loading    = {isLoading}
                                isDisabled = {this.checkIsSubmitDisabled()}
                            />
                        </View>
                    </View>
                </View>
                {/* </KeyboardAwareScroll> */}
            </View>

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
