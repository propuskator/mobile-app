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

import Input                       from '../../../new-ui-kit/Input';
import InfoBlock                   from '../../../new-ui-kit/InfoBlock';

import style                       from './FirstStepStyles';


class FirstStep extends PureComponent {
    static propTypes = {
        colorMode     : PropTypes.string.isRequired,
        t             : PropTypes.func.isRequired,
        onGoNext      : PropTypes.func,
        onInputChange : PropTypes.func,
        errors        : PropTypes.shape({
            workspace : PropTypes.string
        }),
        workspace : PropTypes.string,
        isLoading : PropTypes.bool
    };

    static defaultProps = {
        onGoNext      : void 0,
        workspace     : '',
        errors        : void 0,
        onInputChange : void 0,
        isLoading     : false
    };

    constructor(props) {
        super(props);
        this.workspaceRef = createRef();

        this.inputs = [ this.workspaceRef ];
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

    render() {
        const { colorMode, t, isLoading, workspace, onInputChange, errors } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <Input
                    ref             = {this.workspaceRef}
                    disabled        = {isLoading}
                    label           = {t('Workspace')}
                    placeholder     = {t('Enter your workspace')}
                    name            = {'workspace'}
                    autoCapitalize  = 'none'
                    value           = {workspace}
                    onChange        = {onInputChange}
                    errorMessage    = {errors?.workspace}
                    returnKeyType   = 'next'
                    blurOnSubmit    = {false}
                    onSubmitEditing = {this.handleSubmitEditing.bind(null, 0)}
                    colorMode       = {colorMode}
                />
                <InfoBlock
                    colorMode = {colorMode}
                    t         = {t}
                    tipKey    = {'workspaceTip'}
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
)(withTranslation()(FirstStep));
