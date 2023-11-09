import React, {
    PureComponent,
    createRef
}                                  from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import { withTranslation }         from 'react-i18next';
import {
    View,
    Pressable,
    Keyboard,
    Linking
}                                  from 'react-native';

import config                      from '../../../../config';

import Input                       from '../../../new-ui-kit/Input';
import Checkbox                    from '../../../new-ui-kit/Checkbox';
import Text                        from '../../../new-ui-kit/Text';

import style                       from './ThirdStepStyles';


class ThirdStep extends PureComponent {
    static propTypes = {
        colorMode     : PropTypes.string.isRequired,
        t             : PropTypes.func.isRequired,
        onGoNext      : PropTypes.func,
        onInputChange : PropTypes.func,
        errors        : PropTypes.shape({
            subjectName   : PropTypes.string,
            phone         : PropTypes.string,
            privacyPolicy : PropTypes.string
        }),
        subjectName              : PropTypes.string,
        phone                    : PropTypes.string,
        isPrivacyCheckboxChecked : PropTypes.bool,
        isLoading                : PropTypes.bool,
        onCheckboxChange         : PropTypes.func
    };

    static defaultProps = {
        onGoNext                 : void 0,
        subjectName              : '',
        phone                    : '',
        errors                   : void 0,
        onInputChange            : void 0,
        isPrivacyCheckboxChecked : false,
        isLoading                : false,
        onCheckboxChange         : void 0
    };

    constructor(props) {
        super(props);
        this.subjectNameRef = createRef();
        this.phoneRef = createRef();

        this.inputs = [ this.subjectNameRef, this.phoneRef ];
    }

    handleOpenLink = openedUrl => () => {
        Linking.openURL(openedUrl);
    }

    handleGoNext = () => {
        const { onGoNext } = this.props;

        if (onGoNext) onGoNext();
    }

    handleCheckboxStateChange = () => {
        const { onCheckboxChange } = this.props;

        if (onCheckboxChange) onCheckboxChange({ name: 'isPrivacyCheckboxChecked' });
    }

    handleSubmitEditing = i => {
        if (this.inputs[i + 1]) {
            this.inputs[i + 1].current.focus();
        } else {
            this.handleGoNext();
            Keyboard.dismiss();
        }
    }

    renderPrivacyCheckbox = () => {
        const { colorMode, isPrivacyCheckboxChecked, errors, t } = this.props;
        const policyLink = config.PRIVACY_POLICY;
        const termsOfUseLink = config.TERMS_OF_USE;

        const styles = style(colorMode);

        const textBlock = (
            <View style={styles.checkboxTitleContainer}>
                <Text style={styles.checkboxTitle}>
                    {t('REGISTER_CONFIRM_START')}
                    <Text
                        style   = {styles.checkboxLink}
                        onPress = {this.handleOpenLink(policyLink)}
                    >
                        {t('Privacy Policy_register')}
                    </Text>
                    {t(' and ')}
                    <Text
                        style   = {styles.checkboxLink}
                        onPress = {this.handleOpenLink(termsOfUseLink)}
                    >
                        {t('Terms of Use_register')}
                    </Text>
                    {t('REGISTER_CONFIRM_END')}
                </Text>
            </View>
        );

        const mainBlock = (
            <>
                <Pressable style={styles.checkboxWrapper}>
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

    render() {
        const {
            colorMode, t, isLoading,
            subjectName, phone,
            errors,
            onInputChange
        } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <View style={styles.inputsWrapper}>
                    <Input
                        ref             = {this.subjectNameRef}
                        disabled        = {isLoading}
                        label           = {t('Subject name')}
                        placeholder     = {t('Enter subject name')}
                        name            = {'subjectName'}
                        autoCapitalize  = 'none'
                        value           = {subjectName}
                        onChange        = {onInputChange}
                        errorMessage    = {errors.subjectName}
                        returnKeyType   = 'next'
                        blurOnSubmit    = {false}
                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 0)}
                        colorMode       = {colorMode}
                    />
                    <Input
                        ref             = {this.phoneRef}
                        disabled        = {isLoading}
                        label           = {t('Phone number')}
                        keyboardType    = 'numeric'
                        placeholder     = {t('Enter your number')}
                        subLabel        = {t('*not required')}
                        name            = {'phone'}
                        autoCapitalize  = 'none'
                        value           = {phone}
                        onChange        = {onInputChange}
                        errorMessage    = {errors.phone}
                        returnKeyType   = 'next'
                        blurOnSubmit    = {false}
                        onSubmitEditing = {this.handleSubmitEditing.bind(null, 1)}
                        colorMode       = {colorMode}
                    />
                </View>

                {this.renderPrivacyCheckbox()}

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
)(withTranslation()(ThirdStep));
