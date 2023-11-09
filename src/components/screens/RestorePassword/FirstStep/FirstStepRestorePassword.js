import React, { PureComponent, createRef } from 'react';
import {
    View
}                                          from 'react-native';
import PropTypes                           from 'prop-types';
import { withTranslation }                 from 'react-i18next';
import { connect }                         from 'react-redux';

import { validateRestorePasswordEmail }    from '../../../../utils/validation';

import * as userActions                    from '../../../../actions/users';

import Input                               from '../../../new-ui-kit/Input';
import Button                              from '../../../new-ui-kit/Button';
import KeyboardAwareScroll                 from '../../../new-ui-kit/KeyboardAwareScroll';
import StatusBar                           from '../../../new-ui-kit/StatusBar';

import screens                             from '../../../../new-assets/constants/screens';
import style                               from './FirstStepRestorePasswordStyles';

class FirstStepRestorePassword extends PureComponent {
    static propTypes = {
        colorMode                      : PropTypes.string.isRequired,
        navigation                     : PropTypes.object.isRequired,
        route                          : PropTypes.object.isRequired,
        t                              : PropTypes.func.isRequired,
        updateRestorePasswordWorkspace : PropTypes.func.isRequired,
        updateRestorePasswordEmail     : PropTypes.func.isRequired,
        requestResetPassword           : PropTypes.func.isRequired,
        updateRestorePasswordToken     : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const { email, workspace } = this.props.route.params;

        this.state = {
            email,
            workspace,
            isLoading : false,
            errors    : {}
        };

        this.workspace = createRef();
        this.email     = createRef();

        this.inputs = [ this.workspace, this.email ];
    }
    componentDidMount() {
        const { email, workspace } = this.props.route.params;
        const { updateRestorePasswordEmail, updateRestorePasswordWorkspace } = this.props;

        updateRestorePasswordEmail(email);
        updateRestorePasswordWorkspace(workspace);
    }

    handleInputChange = (key, value) => {
        const { updateRestorePasswordEmail, updateRestorePasswordWorkspace } = this.props;

        if (key === 'email') {
            updateRestorePasswordEmail(value);
        } else {
            updateRestorePasswordWorkspace(value);
        }

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
        const { email, workspace } = this.state;

        validateRestorePasswordEmail({
            data      : { email, workspace },
            onSuccess : this.sendRequestData,
            onError   : errors => this.setState({ errors })
        });
    }

    sendRequestData = async () => {
        const { requestResetPassword, updateRestorePasswordToken, navigation } = this.props;
        const { workspace, email } = this.state;

        this.setState({ isLoading: true });

        await requestResetPassword({
            email,
            workspace,
            onSuccess : token => {
                this.setState({ errors: {} });
                updateRestorePasswordToken(token);
                navigation.navigate(screens.RESTORE_PASS_SECOND);
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
        const errors = { ...(error?.error?.errors || {}) };
        const decodedErrors = {};

        if (error?.error?.type === 'forbidden') {
            decodedErrors.email = error?.error?.message || t('Forbidden');
        } else {
            Object.values(errors).forEach(err => {
                const { field, message } = err;

                decodedErrors[field] = message;
            });
        }

        return decodedErrors;
    }

    checkIsSubmitDisabled = () => {
        const { workspace, email, errors, isLoading } = this.state;

        return isLoading || !(!!workspace && !!email && !errors.email && !errors.workspace);
    }

    render() {
        const { colorMode, t } = this.props;
        const { workspace, email, errors, isLoading } = this.state;

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
                            ref             = {this.workspace}
                            label           = {t('Workspace')}
                            placeholder     = {t('Workspace name')}
                            autoCapitalize  = 'none'
                            name            = {'workspace'}
                            value           = {workspace}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {t(errors.workspace)}
                            returnKeyType   = 'go'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmit(0)}
                            colorMode       = {colorMode}
                        />
                        <Input
                            ref             = {this.email}
                            label           = {t('Email')}
                            placeholder     = {t('Enter your email')}
                            name            = {'email'}
                            value           = {email}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {t(errors.email)}
                            returnKeyType   = 'go'
                            autoCapitalize  = 'none'
                            blurOnSubmit    = {false}
                            onSubmitEditing = {this.handleSubmit(1)}
                            colorMode       = {colorMode}
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
        colorMode : state.theme.mode
    }),
    { ...userActions }
)(withTranslation()(FirstStepRestorePassword));
