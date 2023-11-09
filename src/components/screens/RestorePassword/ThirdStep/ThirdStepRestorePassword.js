import React, { PureComponent, createRef }                 from 'react';
import { View }                                            from 'react-native';
import PropTypes                                           from 'prop-types';
import { withTranslation }                                 from 'react-i18next';
import { connect }                                         from 'react-redux';

import { decodeErrorCode, validateRestorePasswordNewPass } from '../../../../utils/validation';
import { isIOS }                                           from '../../../../utils/platform';
import { dumpUser }                                        from '../../../../utils/dumps/userData';
import Toast                                               from '../../../../utils/Toast';
import sessionManager                                      from '../../../../SessionManager';

import * as userActions                                    from '../../../../actions/users';
import * as sessionActions                                 from '../../../../actions/session';
import * as connectionActions                              from '../../../../actions/connection';
import colors                                              from '../../../../new-assets/constants/colors';

import Input                                               from '../../../new-ui-kit/Input';
import Button                                              from '../../../new-ui-kit/Button';
import PasswordStrength                                    from '../../../new-ui-kit/PasswordStrength';
import KeyboardAwareScroll                                 from '../../../new-ui-kit/KeyboardAwareScroll';
import StatusBar                                           from '../../../new-ui-kit/StatusBar';

import style                                               from './ThirdStepRestorePasswordStyles';


class ThirdStepRestorePassword extends PureComponent {
    static propTypes = {
        navigation    : PropTypes.object.isRequired,
        colorMode     : PropTypes.string.isRequired,
        t             : PropTypes.func.isRequired,
        email         : PropTypes.string.isRequired,
        workspace     : PropTypes.string.isRequired,
        token         : PropTypes.string.isRequired,
        code          : PropTypes.string.isRequired,
        resetPassword : PropTypes.func.isRequired,
        authenticate  : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isPasswordHidden : { password: true, passwordConfirm: true },
            password         : '',
            passwordConfirm  : '',
            formWrapperWidth : 0,
            isLoading        : false,
            errors           : {}
        };

        this.password        = createRef();
        this.passwordConfirm = createRef();

        this.inputs = [ this.password, this.passwordConfirm ];
    }

    handleInputChange = (key, value) => {
        this.setState({ [key]: value, errors: {} });
    }

    handleSubmit = i => () => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else if (!this.checkIsSubmitDisabled()) {
            this.handleValidateForm();
        }
    }

    handleValidateForm = () => {
        const { password, passwordConfirm } = this.state;

        validateRestorePasswordNewPass({
            data      : { password, passwordConfirm },
            onSuccess : () => this.sendRestoreData(),
            onError   : errors => this.setState({ errors })
        });
    }

    sendRestoreData = async () => {
        const { resetPassword, token, code } = this.props;
        const { password, passwordConfirm } = this.state;
        const payload = {
            token,
            code,
            password,
            passwordConfirm
        };

        this.setState({ isLoading: true });

        await resetPassword({
            payload,
            onSuccess : ({ newToken, accessSubject }) => this.handleLogin({ newToken, accessSubject }),
            onError   : errors => this.setState({ errors: this.mapErrors(errors) })
        });

        this.setState({ isLoading: false });
    }

    mapErrors = error => {
        const errors = [ ...(error?.error?.errors || []) ];
        const decodedErrors = {};

        errors.forEach(err => {
            const { field, message } = err;
            const decodedError = decodeErrorCode(message, field);

            decodedErrors[field] = decodedError;
        });

        return decodedErrors;
    }

    handleNavigate = path => () => {
        const { navigation } = this.props;

        navigation.navigate(path);
    }

    handleLogin = async ({ newToken, accessSubject }) => {
        const {  workspace, authenticate, t } = this.props;
        const toastDuration = isIOS ? 2 : 0;

        this.setState({ isLoading: true });
        const dumpedData = dumpUser(
            {
                ...accessSubject,
                jwt : newToken,
                workspace
            });

        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = activeUser?.isAuthenticated;

        authenticate({ newUser: dumpedData, isRequestBiometric: false });

        if (!isUserAuthenticated) {
            Toast.show(t('Password has been successfully changed'), toastDuration);
        }

        this.setState({ isLoading: false });
    }

    handleTogglePassword = key => () => {
        const { isPasswordHidden } = this.state;

        isPasswordHidden[key] = !isPasswordHidden[key];

        this.setState({ isPasswordHidden: { ...isPasswordHidden } });
    }

    renderPasswordStrengthChecker = () => {
        const { colorMode, email } = this.props;
        const { password, formWrapperWidth } = this.state;

        if (!password.length) {
            return null;
        }

        return (
            <PasswordStrength
                password       = {password}
                email          = {email}
                containerWidth = {formWrapperWidth}
                colorMode      = {colorMode}
            />
        );
    }

    handleFormLayout = e => {
        const { width } = e.nativeEvent.layout;

        this.setState({ formWrapperWidth: width });
    }

    checkIsSubmitDisabled = () => {
        const { password, passwordConfirm, errors, isLoading } = this.state;

        return isLoading || !(!!password && !!passwordConfirm && !errors.password && !errors.passwordConfirm);
    }

    render() {
        const { colorMode, t } = this.props;
        const { password, passwordConfirm, isPasswordHidden, errors, isLoading } = this.state;
        const styles = style(colorMode);

        return (
            <KeyboardAwareScroll
                contentContainerStyle = {styles.contentContainer}
                style                 = {styles.container}
            >
                <StatusBar color='white' />
                <View style={styles.content}>
                    <View style={styles.inputsWrapper}>
                        <Input
                            ref             = {this.password}
                            label           = {t('Password')}
                            placeholder     = {t('Enter new password')}
                            name            = {'password'}
                            autoCapitalize  = 'none'
                            value           = {password}
                            secureTextEntry = {isPasswordHidden.password}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.password}
                            returnKeyType   = 'go'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmit(0)}
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
                            label           = {t('Confirm password')}
                            placeholder     = {t('Enter new password')}
                            name            = {'passwordConfirm'}
                            autoCapitalize  = 'none'
                            value           = {passwordConfirm}
                            secureTextEntry = {isPasswordHidden.passwordConfirm}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.passwordConfirm}
                            returnKeyType   = 'go'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmit(1)}
                            colorMode       = {colorMode}
                            rightIcon       = {{
                                name    : isPasswordHidden.passwordConfirm ? 'eye-outline' : 'eye-off-outline',
                                type    : 'material-community',
                                color   : colors[colorMode].PRIMARY,
                                size    : 28,
                                onPress : this.handleTogglePassword('passwordConfirm')
                            }}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title      = {t('Continue')}
                            onPress    = {this.handleValidateForm}
                            loading    = {isLoading}
                            isDisabled = {this.checkIsSubmitDisabled()}
                        />
                    </View>
                </View>
            </KeyboardAwareScroll>
        );
    }
}

export default connect(
    state => ({
        workspace : state.users.restorePassword.workspace,
        email     : state.users.restorePassword.email,
        token     : state.users.restorePassword.token,
        code      : state.users.restorePassword.code,
        colorMode : state.theme.mode
    }),
    {
        ...userActions,
        ...sessionActions,
        ...connectionActions

    }
)(withTranslation()(ThirdStepRestorePassword));
