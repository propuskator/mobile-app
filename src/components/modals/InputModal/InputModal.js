import React, { PureComponent }                 from 'react';
import { View }                                 from 'react-native';
import PropTypes                                from 'prop-types';

import { withTranslation }                      from 'react-i18next';
import Input                                    from '../../new-ui-kit/Input';
import Button                                   from '../../new-ui-kit/Button';
import Modal                                    from '../../new-ui-kit/Modal';
import colors                                   from '../../../new-assets/constants/colors';

import style                                    from './InputModalStyle';


class InputModal extends PureComponent {
    static propTypes = {
        value           : PropTypes.string,
        isProcessing    : PropTypes.bool,
        colorMode       : PropTypes.string.isRequired,
        t               : PropTypes.func.isRequired,
        isDeviceDisable : PropTypes.bool.isRequired,
        isEditMode      : PropTypes.bool,
        onSave          : PropTypes.func.isRequired,
        onDismiss       : PropTypes.func.isRequired,
        visible         : PropTypes.bool.isRequired,
        maxLength       : PropTypes.number,
        header          : PropTypes.object.isRequired
    }

    static defaultProps = {
        value        : '',
        maxLength    : void 0,
        isProcessing : false,
        isEditMode   : false
    }

    constructor(props) {
        super(props);

        this.state = {
            value        : props.value,
            isProcessing : false,
            errors       : {}
        };
    }

    componentDidUpdate(prevProps) {
        const { visible, value:propsValue } = this.props;

        if (prevProps.visible !== visible && visible) {
            this.setState({ value: propsValue });
        }
    }

    handleChange = (key, value) => {
        this.setState({ value, errors: {} });
    }

    handleSubmit = () => {
        const { onSave } = this.props;
        const { value, isProcessing } = this.state;

        if (isProcessing) return;
        if (value?.trim() === this.props?.value) return this.handleDissmiss();

        this.setState({ isProcessing: true });

        onSave({
            value,
            onSuccess : () => {
                this.setState({ errors: {}, isProcessing: false });
                this.handleDissmiss();
            },
            onError : (errors) => {
                this.setState({ errors, isProcessing: false });
            }
        });
    }

    handleDissmiss = () => {
        const { onDismiss } = this.props;

        this.setState({ isProcessing: false, value: '', errors: {} });
        if (onDismiss) onDismiss();
    }

    handleClearInput=() => {
        this.setState({ value: '' });
    }

    checkIsDisabled = () => {
        const { isDeviceDisable, isEditMode, isProcessing } = this.props;
        const { errors } = this.state;

        return isDeviceDisable || isEditMode || isProcessing || this.state.isProcessing || errors?.value;
    }

    render() {
        const {
            colorMode,
            header,
            onDismiss,  // eslint-disable-line
            visible,
            maxLength,
            t,
            ...restProps
        } = this.props;
        const { errors } = this.state;
        const value = value && maxLength ? this?.state?.value?.slice(0, maxLength) : this?.state?.value || '';

        const styles = style(colorMode);

        return (
            <Modal
                height        = {280}
                header        = {header}
                visible       = {visible}
                colorMode     = {colorMode}
                onDismiss     = {this.handleDissmiss}
                withCloseIcon
            >
                <View style={styles.modalContainer}>
                    <Input
                        {...restProps}
                        name            = {header}
                        colorMode       = {colorMode}
                        value           = {value}
                        errorMessage    = {errors?.value}
                        onChange        = {this.handleChange}
                        onSubmitEditing = {this.handleSubmit}
                        returnKeyType   = 'done'
                        subLabel        = {maxLength ? `${value?.length}/${maxLength}` : void 0}
                        maxLength       = {maxLength}
                        rightIcon       = {{
                            name    : 'clear',
                            color   : colors[colorMode].TEXT_SECONDARY,
                            onPress : this.handleClearInput
                        }}
                        autoFocus
                    />
                    <View style={styles.buttonWrapper}>
                        <Button
                            style      = {styles.button}
                            title      = {t('Save')}
                            onPress    = {this.handleSubmit}
                            loading    = {this.state?.isProcessing || this.props.isProcessing}
                            isDisabled = {!value?.trim()?.length}
                        />
                    </View>
                </View>
            </Modal>

        );
    }
}

export default withTranslation()(InputModal);
