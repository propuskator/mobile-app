import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import {
    View
}                                      from 'react-native';
import { withTranslation }             from 'react-i18next';
import { connect }                     from 'react-redux';

import { validateRestorePasswordCode } from '../../../../utils/validation';
import * as userActions                from '../../../../actions/users';

import screens                         from '../../../../new-assets/constants/screens';

import Input                           from '../../../new-ui-kit/Input';
import Button                          from '../../../new-ui-kit/Button';
import InfoBlock                       from '../../../new-ui-kit/InfoBlock';
import KeyboardAwareScroll             from '../../../new-ui-kit/KeyboardAwareScroll';
import StatusBar                       from '../../../new-ui-kit/StatusBar';

import style                           from './SecondStepRestorePasswordStyles';

class SecondStepRestorePassword extends PureComponent {
    static propTypes = {
        colorMode                 : PropTypes.string.isRequired,
        navigation                : PropTypes.object.isRequired,
        t                         : PropTypes.func.isRequired,
        updateRestorePasswordCode : PropTypes.func.isRequired,
        validateResetCode         : PropTypes.func.isRequired,
        code                      : PropTypes.string.isRequired,
        token                     : PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            code      : '',
            errors    : {},
            isLoading : false
        };
    }

    handleInputChange = (key, value) => {
        const { updateRestorePasswordCode } = this.props;

        updateRestorePasswordCode(value);
        this.setState({ [key]: value, errors: {} });
    }

    handleSubmit = () => {
        const { code } = this.state;

        if (this.checkIsSubmitDisabled()) return;

        validateRestorePasswordCode({
            data      : { code },
            onSuccess : () => this.sendRequestData(),
            onError   : errors => this.setState({ errors })
        });
    }

    sendRequestData = async () => {
        const { validateResetCode, navigation, code, token } = this.props;

        this.setState({ isLoading: true });

        await validateResetCode({
            code,
            token,
            onSuccess : () => {
                this.setState({ errors: {} });

                navigation.navigate(screens.RESTORE_PASS_THIRD);
            },
            onError : error => {
                const errors = this.mapErrors(error);

                this.setState({ errors });
            }
        });

        this.setState({ isLoading: false });
    }

    mapErrors = error => {
        const { t } = this.props;
        const errors = { ...(error?.error || {}) };
        const decodedError = { code: '' };

        if (errors?.type === 'forbidden') {
            decodedError.code = errors?.message || t('Forbidden');
        } else {
            decodedError.code = errors.message;
        }

        return decodedError;
    }

    checkIsSubmitDisabled = () => {
        const { code, errors, isLoading } = this.state;

        return isLoading || !(!!code && !errors.code);
    }

    render() {
        const { colorMode, t } = this.props;
        const { code, errors, isLoading } = this.state;

        const styles = style(colorMode);

        return (
            <KeyboardAwareScroll
                contentContainerStyle = {styles.contentContainer}
                style                 = {styles.container}
            >
                <StatusBar color='white' />
                <View style = {styles.content}>
                    <View style={styles.inputsWrapper}>
                        <Input
                            label           = {t('Restore password code')}
                            placeholder     = {t('Enter the code')}
                            name            = {'code'}
                            value           = {code}
                            autoCapitalize  = 'none'
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.code}
                            returnKeyType   = 'go'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmit}
                            colorMode       = {colorMode}
                        />
                        <InfoBlock
                            colorMode = {colorMode}
                            t         = {t}
                            tipKey    = {'restorePasswordCodeTip'}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Button
                            title      = {t('Continue')}
                            onPress    = {this.handleSubmit}
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
        colorMode : state.theme.mode,
        code      : state.users.restorePassword.code,
        token     : state.users.restorePassword.token
    }),
    { ...userActions }
)(withTranslation()(SecondStepRestorePassword));
