import React, { PureComponent, createRef } from 'react';
import PropTypes                           from 'prop-types';
import { connect }                         from 'react-redux';
import { withTranslation }                 from 'react-i18next';

import {
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    View
}                                          from 'react-native';

import { withKeyboardEvents }              from '../../hoc/withKeyboardEvents';
import { validateEditInput }               from '../../../utils/validation';

import Input                               from '../../ui-kit/Input';
import Button                              from '../../new-ui-kit/Button';
import Text                                from '../../ui-kit/Text';

import colors                              from '../../../assets/constants/colors';
import { isIOS }                           from '../../../utils/platform';
import screens                             from '../../../new-assets/constants/screens';

import style                               from './EditInputScreenStyles';

class EditInputScreen extends PureComponent {
    static propTypes = {
        route          : PropTypes.object.isRequired,
        navigation     : PropTypes.object.isRequired,
        colorMode      : PropTypes.string.isRequired,
        keyboardHeight : PropTypes.number.isRequired,
        t              : PropTypes.func.isRequired

    }

    constructor(props) {
        super(props);

        this.state = {
            value     : props.route.params.value,
            error     : '',
            isLoading : false
        };

        this.input = createRef();
    }


    componentDidMount() {
        const { navigation } = this.props;

        this.handleFocus();
        navigation.addListener('beforeRemove', this.goBackListener);
    }

    componentWillUnmount() {
        const {  navigation } = this.props;

        navigation.removeListener('beforeRemove', this.goBackListener);
    }

    goBackListener = e => {
        const { route, navigation } = this.props;
        const previousScreen = route?.params?.previousScreen;

        if (previousScreen) {
            e.preventDefault();

            return navigation.navigate(previousScreen, {
                previousScreen : screens.EDIT_INPUT
            });
        }
    }

    handleFocus() {
        if (this.input) {
            setTimeout(() => {
                this.input.current.focus();
            });
        }
    }

    handleBlur() {
        Keyboard.dismiss();
    }

    handleChange = (key, value) => {
        const { preprocessValue } = this.props.route.params;

        if (preprocessValue) {
            const newValue = preprocessValue(value);

            if (newValue === undefined) return;

            this.setState({ [key]: newValue, error: '' });
        } else {
            this.setState({ [key]: value, error: '' });
        }
    }

    handleClear = () => this.setState({ value: '' });

    handleValidateInput = () => {
        const { value } = this.state;

        validateEditInput({
            data      : { value },
            onSuccess : this.handleSave,
            onError   : error => this.setState({ error: error.value })
        });
    }

    handleSave = async () => {
        const { navigation, route, t } = this.props;
        const { onSave } = route.params;
        const { value } = this.state;

        this.setState({ isLoading: true });

        try {
            onSave({
                value,
                onSuccess : () => navigation.goBack(),
                onError   : ({ error, target = 'alert' }) => {
                    switch (target) {
                        case 'state':
                            this.setState({ error: error.name });
                            break;
                        case 'alert': {
                            Alert.alert(t('Error'), t(error.message));
                            break;
                        }
                        default:
                            break;
                    }
                },
                onFinally : () => this.setState({ isLoading: false })
            });
        } catch (error) {
            // pass
        }
    }

    handleKeyboardClose() {
        Keyboard.dismiss();
    }

    rightIconProps = () => {
        const { colorMode } = this.props;

        return {
            name    : 'clear',
            color   : colors[colorMode].TEXT_SECONDARY,
            onPress : this.handleClear
        };
    }

    render() {
        const {
            keyboardType,
            description,
            placeholder,
            buttonTitle,
            multiline,
            autoCapitalize
        } = this.props.route.params;
        const { value, isLoading, error } = this.state;
        const { colorMode, t, keyboardHeight } = this.props;
        const paddingBottom = !!keyboardHeight ? keyboardHeight : 20;

        const styles = style(colorMode);

        return (
            <TouchableWithoutFeedback onPress={this.handleKeyboardClose}>
                <View
                    style = {{
                        ...styles.container,
                        ...isIOS && { paddingBottom }
                    }}
                >
                    <View>
                        {description && <Text style={styles.description}>{description}</Text>}

                        <Input
                            ref             = {this.input}
                            name            = 'value'
                            value           = {value}
                            placeholder     = {placeholder || ''}
                            onChange        = {this.handleChange}
                            {...!multiline && { onSubmitEditing: this.handleValidateInput }}
                            keyboardType    = {keyboardType}
                            editable        = {!isLoading}
                            colorMode       = {colorMode}
                            errorMessage    = {error}
                            multiline       = {multiline}
                            {...!isLoading && !!value && { rightIcon: this.rightIconProps() }}
                            {...autoCapitalize  ? { autoCapitalize } : {}}
                        />
                    </View>
                    <Button
                        title   = {t(buttonTitle) || t('Save changes')}
                        onPress = {this.handleValidateInput}
                        loading = {isLoading}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default withKeyboardEvents(
    connect(
        state => ({
            colorMode : state.theme.mode
        })
    )(withTranslation()(EditInputScreen)),
    true
);
