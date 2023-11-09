import React, {
    PureComponent,
    createRef
}                                  from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import { withTranslation }         from 'react-i18next';
import {
    View,
    Keyboard
}                                  from 'react-native';

import colors                      from '../../../../new-assets/constants/colors';
import Input                       from '../../../new-ui-kit/Input';
import PasswordStrength            from '../../../new-ui-kit/PasswordStrength';

import style                       from './SecondStepStyles';


class SecondStep extends PureComponent {
    static propTypes = {
        colorMode     : PropTypes.string.isRequired,
        t             : PropTypes.func.isRequired,
        onGoNext      : PropTypes.func,
        onInputChange : PropTypes.func,
        errors        : PropTypes.shape({
            email           : PropTypes.string,
            password        : PropTypes.string,
            passwordConfirm : PropTypes.string
        }),
        email            : PropTypes.string,
        password         : PropTypes.string,
        passwordConfirm  : PropTypes.string,
        isLoading        : PropTypes.bool,
        isPasswordHidden : PropTypes.shape({
            password        : PropTypes.bool,
            passwordConfirm : PropTypes.bool
        }),
        onTogglePassword : PropTypes.func
    };

    static defaultProps = {
        onGoNext         : void 0,
        email            : '',
        password         : '',
        passwordConfirm  : '',
        errors           : void 0,
        onInputChange    : void 0,
        isLoading        : false,
        isPasswordHidden : void 0,
        onTogglePassword : void 0
    };

    constructor(props) {
        super(props);
        this.emailRef = createRef();
        this.passwordRef = createRef();
        this.passwordConfirmRef = createRef();

        this.inputs = [ this.emailRef, this.passwordRef, this.passwordConfirmRef ];
    }

    handleGoNext = () => {
        const { onGoNext } = this.props;

        if (onGoNext) onGoNext();
    }

    handleSubmitEditing = i => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else {
            this.handleGoNext();
            Keyboard.dismiss();
        }
    }

    renderPasswordStrength = (styles) => {
        const { colorMode,  password, email } = this.props;

        if (!password?.length) return null;

        return (
            <View style={styles.passwordStrengthWrapper}>
                <PasswordStrength
                    password  = {password}
                    email     = {email}
                    colorMode = {colorMode}
                />
            </View>
        );
    }

    render() {
        const {
            colorMode, t, isLoading,
            email, password, passwordConfirm,
            onInputChange, errors, isPasswordHidden,
            onTogglePassword
        } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <Input
                    ref             = {this.emailRef}
                    keyboardType    = 'email-address'
                    disabled        = {isLoading}
                    label           = {t('Email')}
                    placeholder     = {t('Enter your email')}
                    name            = {'email'}
                    autoCapitalize  = 'none'
                    value           = {email}
                    onChange        = {onInputChange}
                    errorMessage    = {errors.email}
                    returnKeyType   = 'next'
                    blurOnSubmit    = {false}
                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 0)}
                    colorMode       = {colorMode}
                />
                <Input
                    ref             = {this.passwordRef}
                    disabled        = {isLoading}
                    label           = {t('Password')}
                    placeholder     = {t('Enter your password')}
                    autoCapitalize  = 'none'
                    secureTextEntry = {isPasswordHidden?.password}
                    name            = {'password'}
                    subLabel        = {t('minimum 6 symbols')}
                    value           = {password}
                    onChange        = {onInputChange}
                    errorMessage    = {errors?.password}
                    returnKeyType   = 'next'
                    blurOnSubmit    = {false}
                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 1)}
                    colorMode       = {colorMode}
                    rightIcon       = {{
                        name    : isPasswordHidden?.password ? 'eye-outline' : 'eye-off-outline',
                        type    : 'material-community',
                        color   : colors[colorMode].PRIMARY,
                        onPress : onTogglePassword('password')
                    }}
                />

                { this.renderPasswordStrength(styles) }

                <Input
                    ref             = {this.passwordConfirmRef}
                    disabled        = {isLoading}
                    label           = {t('Confirm password')}
                    placeholder     = {t('Confirm your password')}
                    autoCapitalize  = 'none'
                    secureTextEntry = {isPasswordHidden?.passwordConfirm}
                    name            = {'passwordConfirm'}
                    value           = {passwordConfirm}
                    onChange        = {onInputChange}
                    errorMessage    = {errors.passwordConfirm}
                    returnKeyType   = 'go'
                    blurOnSubmit    = {false}
                    colorMode       = {colorMode}
                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 2)}
                    rightIcon       = {{
                        name : isPasswordHidden?.passwordConfirm
                            ? 'eye-outline' : 'eye-off-outline',
                        type    : 'material-community',
                        color   : colors[colorMode].PRIMARY,
                        onPress : onTogglePassword('passwordConfirm')
                    }}
                />
            </View>
        );
    }
}

export default connect(
    (state) => {
        return {
            colorMode : state.theme.mode
        };
    }
)(withTranslation()(SecondStep));
