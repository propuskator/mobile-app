import React, { createRef, PureComponent }                 from 'react';
import {
    View,
    Keyboard
}                                                          from 'react-native';
import { connect }                                         from 'react-redux';
import PropTypes                                           from 'prop-types';
import { withTranslation }                                 from 'react-i18next';

import Input                                               from '../../new-ui-kit/Input';
import Button                                              from '../../new-ui-kit/Button';
import PasswordStrength                                    from '../../new-ui-kit/PasswordStrength';
import KeyboardAwareScroll                                 from '../../new-ui-kit/KeyboardAwareScroll';
import StatusBar                                           from '../../new-ui-kit/StatusBar';

import * as usersActions                                   from '../../../actions/users';
import sessionManager                                      from '../../../SessionManager';
import Toast                                               from '../../../utils/Toast';
import { mapErrors, validateChangePassword }               from '../../../utils/validation';
import { isIOS }                                           from '../../../utils/platform';

import colors                                              from '../../../new-assets/constants/colors';

import style                                               from './ChangePasswordScreenStyles';

class ChangePasswordScreen extends PureComponent {
    static propTypes = {
        updateUserPassword : PropTypes.func.isRequired,
        navigation         : PropTypes.object.isRequired,
        t                  : PropTypes.func.isRequired,
        colorMode          : PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading        : false,
            oldPassword      : '',
            newPassword      : '',
            passwordConfirm  : '',
            errors           : {},
            isFocused        : false,
            isPasswordHidden : {
                oldPassword     : true,
                newPassword     : true,
                passwordConfirm : true
            }
        };

        this.oldPassword       = createRef();
        this.newPassword        = createRef();
        this.passwordConfirm = createRef();

        this.inputs = [ this.oldPassword, this.newPassword, this.passwordConfirm ];
    }

    handleKeyboardClose = () => {
        this.setState({ isFocused: false });

        Keyboard.dismiss();
    }

    handleInputChange = (key, value) => {
        this.setState({
            [key]  : value,
            errors : {}
        });
    }

    handleFocused = () => {
        this.setState({ isFocused: true });
    }

    handleSubmitEditing = i => () => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else {
            this.handleKeyboardClose();
            if (!this.checkIsSubmitDisabled()) this.handleChangePassword();
        }
    }

    handleTogglePassword = key => () => {
        const { isPasswordHidden } = this.state;

        isPasswordHidden[key] = !isPasswordHidden[key];

        this.setState({ isPasswordHidden: { ...isPasswordHidden } });
    }

    handleChangePassword = async () => {
        const { oldPassword, newPassword, passwordConfirm } = this.state;
        const { updateUserPassword } = this.props;
        const payload = {
            oldPassword,
            newPassword,
            passwordConfirm
        };

        validateChangePassword({
            data : {
                oldPassword, newPassword, passwordConfirm
            },
            onSuccess : async () => {
                this.setState({ isLoading: true });

                await updateUserPassword({
                    payload,
                    onError   : error => this.handleCreateError(error),
                    onSuccess : res => this.handleSuccess(res)
                });
            },
            onError : errors => this.handleError(errors)
        });
    }

    handleError = errors => {
        this.setState({
            isLoading : false,
            errors
        });
    }

    handleCreateError = error => {
        const errors = mapErrors(error);

        this.setState({
            isLoading : false,
            errors
        });
    }

    handleSuccess = () => {
        const { navigation, t } = this.props;
        const toastDuration = isIOS ? 2 : 0;

        Toast.show(t('Password has been successfully changed'), toastDuration);

        this.setState({ isLoading: false });

        navigation.goBack();
    }

    checkIsSubmitDisabled = () => {
        const { oldPassword, newPassword, passwordConfirm } = this.state;

        return !oldPassword || !newPassword || !passwordConfirm;
    }

    renderPasswordStrengthChecker = () => {
        const { colorMode } = this.props;
        const { email } = sessionManager.getActiveUser();


        const { newPassword } = this.state;

        if (!newPassword.length) {
            return null;
        }

        return (
            <PasswordStrength
                password  = {newPassword}
                email     = {email}
                colorMode = {colorMode}
            />
        );
    }

    render() {
        const { colorMode } = this.props;
        const {
            isLoading,
            oldPassword,
            errors,
            isPasswordHidden,
            newPassword,
            passwordConfirm
            // isFocused
        } = this.state;
        const { t } = this.props;

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
                            ref             = {this.oldPassword}
                            disabled        = {isLoading}
                            label           = {t('Current password')}
                            placeholder     = {t('Enter current password')}
                            name            = {'oldPassword'}
                            autoCapitalize  = 'none'
                            value           = {oldPassword}
                            secureTextEntry = {isPasswordHidden.oldPassword}
                            onFocus         = {this.handleFocused}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.oldPassword}
                            returnKeyType   = 'next'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmitEditing(0)}
                            colorMode       = {colorMode}
                            autoFocus
                            rightIcon       = {{
                                name    : isPasswordHidden.oldPassword ? 'eye-outline' : 'eye-off-outline',
                                type    : 'material-community',
                                color   : colors[colorMode].PRIMARY,
                                onPress : this.handleTogglePassword('oldPassword'),
                                size    : 28
                            }}
                        />
                        <Input
                            ref             = {this.newPassword}
                            disabled        = {isLoading}
                            label           = {t('New password')}
                            placeholder     = {t('Enter new password')}
                            name            = {'newPassword'}
                            autoCapitalize  = 'none'
                            value           = {newPassword}
                            secureTextEntry = {isPasswordHidden.newPassword}
                            onFocus         = {this.handleFocused}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.newPassword}
                            returnKeyType   = 'next'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmitEditing(1)}
                            colorMode       = {colorMode}
                            rightIcon       = {{
                                name    : isPasswordHidden.newPassword ? 'eye-outline' : 'eye-off-outline',
                                type    : 'material-community',
                                color   : colors[colorMode].PRIMARY,
                                size    : 28,
                                onPress : this.handleTogglePassword('newPassword')
                            }}
                        />

                        {this.renderPasswordStrengthChecker()}

                        <Input
                            ref             = {this.passwordConfirm}
                            disabled        = {isLoading}
                            label           = {t('Confirm new password')}
                            placeholder     = {t('Confirm new password')}
                            name            = {'passwordConfirm'}
                            autoCapitalize  = 'none'
                            value           = {passwordConfirm}
                            secureTextEntry = {isPasswordHidden.passwordConfirm}
                            onFocus         = {this.handleFocused}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.passwordConfirm}
                            returnKeyType   = 'go'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmitEditing(2)}
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
                            title      = {t('Save changes')}
                            onPress    = {this.handleChangePassword}
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
        colorMode : state.theme.mode
    }),
    { ...usersActions }
)(withTranslation()(ChangePasswordScreen));
