import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';

import colors                       from '../../../new-assets/constants/colors';

import Input                        from '../../new-ui-kit/Input';
import Button                       from '../../new-ui-kit/Button';
import KeyboardAwareScroll          from '../../new-ui-kit/KeyboardAwareScroll';

import * as usersActions            from '../../../actions/users';
import { setAppUrls }               from '../../../utils/urlSettings';
import { validateIp }               from '../../../utils/validation';
import config                       from '../../../config';

import style                        from './IpSettingsStyles';


class IpSettings extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        t          : PropTypes.func.isRequired,
        // disableBiometric : PropTypes.func.isRequired,
        colorMode  : PropTypes.string.isRequired,
        route      : PropTypes.object.isRequired
    }

    state = {
        ipAdress : config.API_URL,
        errors   : {}
    }
    async componentDidMount() {
        const { navigation } = this.props;

        this.fillState();
        navigation.addListener('focus', this.fillState);
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('focus', this.fillState);
    }

    fillState = async () => {
        const { params } = this.props.route;


        if (params?.user) {
            const usersUrl = params?.user?.url || '';

            this.setState({
                ipAdress : usersUrl
            });
        }
    }


    handleInputChange = (key, value) => {
        this.setState({
            [key]  : value,
            errors : {}
        });
    }


    handleCancel=() => {
        this.props.navigation.goBack(null);
    }


    handleSave = async () => {
        const { ipAdress } = this.state;
        const { params } = this.props.route;

        if (this.checkIsSubmitDisabled()) return;

        const onSave = params?.onSave;

        validateIp({
            url       : ipAdress,
            onSuccess : async validData => {
                this.setState({ isLoading: true });
                setAppUrls(validData.ipAdress);
                if (onSave) onSave();
                this.setState({ isLoading: false });
                this.props.navigation.goBack(null, { clearState: true });
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

    handleClearInput = () => {
        this.setState({
            ipAdress : '',
            errors   : {}
        });
    }

    checkIsSubmitDisabled = () => {
        const { ipAdress, errors, isLoading } = this.state;

        return isLoading || !(!!ipAdress && !errors.ipAdress);
    }

    render() {
        const { colorMode } = this.props;
        const { ipAdress, errors } = this.state;
        const { t } = this.props;
        const styles = style(colorMode);

        const isIpValid = !!ipAdress?.trim()?.length;

        return (
            <KeyboardAwareScroll
                contentContainerStyle = {styles.contentContainer}
                style                 = {styles.container}
            >
                <View style={styles.content}>
                    <View style={styles.inputsWrapper}>
                        <Input
                            label           = {t('Server URL')}
                            placeholder     = {t('Enter server URL')}
                            name            = {'ipAdress'}
                            autoCapitalize  = 'none'
                            value           = {ipAdress}
                            onChange        = {this.handleInputChange}
                            errorMessage    = {errors.ipAdress}
                            onSubmitEditing = {this.handleSave}
                            colorMode       = {colorMode}
                            {...isIpValid && { rightIcon : {
                                name    : 'clear',
                                color   : colors[colorMode].TEXT_SECONDARY,
                                onPress : this.handleClearInput
                            } }}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Button
                            title          = {t('Save')}
                            onPress        = {this.handleSave}
                            isDisabled     = {this.checkIsSubmitDisabled()}
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
    {
        ...usersActions
    }
)(withTranslation()(IpSettings));
