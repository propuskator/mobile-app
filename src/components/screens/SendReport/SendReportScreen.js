import React, {
    PureComponent
}                                    from 'react';
import { View }                      from 'react-native';
import PropTypes                     from 'prop-types';
import { connect }                   from 'react-redux';
import { withTranslation }           from 'react-i18next';

import * as issuesActions            from '../../../actions/issues';

import { validateReportText }        from '../../../utils/validation';
import Toast                         from '../../../utils/Toast';

import StatusBar                     from '../../new-ui-kit/StatusBar';
import Text                          from '../../new-ui-kit/Text';
import Input                         from '../../new-ui-kit/Input';
import Button                        from '../../new-ui-kit/Button';
import KeyboardAwareScroll           from '../../new-ui-kit/KeyboardAwareScroll';

import style                         from './SendReportScreenStyles';

class SendReportScreen extends PureComponent {
    static propTypes = {
        colorMode  : PropTypes.string.isRequired,
        navigation : PropTypes.object.isRequired,
        sendIssue  : PropTypes.func.isRequired,
        route      : PropTypes.object.isRequired,
        t          : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            report    : '',
            errors    : {},
            isLoading : false
        };
    }

    handleSubmit = () => {
        const { report } = this.state;

        validateReportText({
            data      : { report },
            onSuccess : () => this.sendReport(),
            onError   : errors => this.setState({ errors })
        });
    }

    handleInputChange = (key, value) => {
        this.setState({ [key]: value, errors: {} });
    }

    sendReport = async () => {
        const { report: message } = this.state;
        const { route: { params }, sendIssue } = this.props;
        const { type } = params;
        const payload = { message, type };

        this.setState({ isLoading: true });

        await sendIssue({
            payload,
            onSuccess : () => this.handleSuccessReport(),
            onError   : error => console.log(error)
        });

        this.setState({ isLoading: false });
    }


    handleSuccessReport = () => {
        const { navigation, t } = this.props;

        Toast.show(t('Report has been successfully sent'));

        navigation.goBack();
    }

    render() {
        const { report, isLoading, errors } = this.state;
        const { colorMode, route, t } = this.props;
        const { params: { description } } = route;

        const styles = style(colorMode);

        return (
            <>
                <StatusBar color='white' withHeight={false} />
                <KeyboardAwareScroll
                    contentContainerStyle        = {styles.scrollContentStyle}
                    showsVerticalScrollIndicator = {false}
                    style                        = {styles.container}
                >
                    <View>
                        { description
                            ? (
                                <Text
                                    style            = {styles.description}
                                    color            = 'greenDark'
                                    allowFontScaling = {false}
                                >
                                    {description}
                                </Text>
                            ) : null
                        }
                        <Input
                            inputStyle          = {styles.inputContainer}
                            inputContainerStyle = {styles.inputContainer}
                            placeholder         = {t('Describe the problem')}
                            name                = {'report'}
                            value               = {report}
                            onChange            = {this.handleInputChange}
                            errorMessage        = {errors.report}
                            returnKeyType       = 'next'
                            colorMode           = {colorMode}
                            allowFontScaling    = {false}
                            multiline
                            autoFocus
                        />
                    </View>

                    <Button
                        containerStyle = {styles.submitButton}
                        title      = {t('Send')}
                        loading    = {isLoading}
                        isDisabled = {isLoading || !(report || '')?.trim()?.length}
                        onPress    = {this.handleSubmit}
                    />
                </KeyboardAwareScroll>
            </>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    { ...issuesActions }
)(withTranslation()(SendReportScreen));

