import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { View }                 from 'react-native';
import { Switch }               from 'react-native-switch';
import { MaterialIndicator }    from 'react-native-indicators';

import styles                   from './ToggleStyles';

const THUMB_COLOR = '#FFFFFF';
const COLORS = {
    error   : '#FF7070',
    success : '#04C0B2'
};

class Toggle extends PureComponent {
    static propTypes = {
        value        : PropTypes.bool.isRequired,
        onChange     : PropTypes.func,
        isEditable   : PropTypes.bool,
        isProcessing : PropTypes.bool
    }

    static defaultProps = {
        isEditable   : true,
        isProcessing : false,
        onChange     : undefined
    }

    state = {
        timeout : null
    }


    handleSwitchToggle = async () => {
        const { value, onChange } = this.props;

        const nextValue = !this.getValueChecked(value);

        await onChange({ value: nextValue });
    }

    handleStopPropagation = e => e.stopPropagation()

    getValueChecked = value => typeof value === 'boolean' ? value : value === 'true'

    renderSpinner = () => {
        const { value, isProcessing } = this.props;
        const spinnerStyles           = [ styles.spinner, value && styles.checked ];

        return isProcessing && <MaterialIndicator
            color = {THUMB_COLOR}
            size  = {28}
            style = {spinnerStyles}
        />;
    }

    render() {
        const { value, isEditable, isProcessing } = this.props;
        const circleColor = isProcessing ? 'transparent' : THUMB_COLOR;
        const isDisabled =  !isEditable || isProcessing;
        const containerStyles = [ styles.container, isDisabled && styles.disabled ];

        return (
            <View style={containerStyles}>
                <Switch
                    value                  = {this.getValueChecked(value)}
                    changeValueImmediately = {false}
                    disabled               = {isDisabled}
                    onValueChange          = {this.handleSwitchToggle}
                    renderInsideCircle     = {this.renderSpinner}
                    circleSize             = {28}
                    circleBorderWidth      = {0}
                    barHeight              = {33}
                    circleActiveColor      = {circleColor}
                    circleInActiveColor    = {circleColor}
                    backgroundInactive     = {COLORS.error}
                    backgroundActive       = {COLORS.success}
                    switchLeftPx           = {2.5}
                    switchRightPx          = {2.5}
                    renderActiveText       = {false}
                    renderInActiveText     = {false}
                />
            </View>
        );
    }
}

export default Toggle;
