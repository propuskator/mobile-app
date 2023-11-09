import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { View }                 from 'react-native';
import { Switch }               from 'react-native-switch';
import { MaterialIndicator }    from 'react-native-indicators';
import { connect }      from 'react-redux';

import styles                   from './ToggleStyles';

const THUMB_COLOR = '#FFFFFF';
const COLORS = {
    error : {
        light : '#DCDCDC',
        dark  : '#747780'
    },
    success : '#04C0B2'
};

class Toggle extends PureComponent {
    static propTypes = {
        value        : PropTypes.bool.isRequired,
        onChange     : PropTypes.func,
        isProcessing : PropTypes.bool,
        isSettable   : PropTypes.bool,
        isEditable   : PropTypes.bool,
        isClickable  : PropTypes.bool,
        colorMode    : PropTypes.string.isRequired,
        type         : PropTypes.oneOf([ 'bool', 'string' ])
    }

    static defaultProps = {
        isProcessing : false,
        isSettable   : true,
        isEditable   : true,
        isClickable  : false,
        type         : 'string',
        onChange     : undefined
    }

    state = {
        isProcessing : this.props.isProcessing,
        timeout      : null
    }


    handleSwitchToggle = value => {
        const { onChange, type } = this.props;

        if (type === 'string') {
            onChange({ value: `${value}` });
        } else {
            onChange({ value });
        }

        // if (type === 'string') {
        //     const nextValue = !this.getValueChecked(value);
        //
        //     if (!isProcessing)  onChange({ value: `${nextValue}` });
        // } else if (!isProcessing)  onChange({ value: !value });
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
        const { value,
            isProcessing,
            isSettable,
            isEditable,
            isClickable,
            colorMode
        } = this.props;
        const isDisabled = !isSettable || !isEditable || isProcessing;
        const containerStyles = [ styles.container, isDisabled && styles.disabled ];
        const circleColor = isProcessing ? 'transparent' : THUMB_COLOR;

        // 'isClickable' resolves on issue when an event
        // should be fired on the pressable container and not the switch itself
        return (
            <View style={containerStyles} pointerEvents={isClickable ? 'box-none' : 'none'}>
                <Switch
                    value               = {this.getValueChecked(value)}
                    onValueChange       = {this.handleSwitchToggle}
                    disabled            = {!isEditable}
                    renderInsideCircle  = {this.renderSpinner}
                    circleSize          = {28}
                    circleBorderWidth   = {0}
                    barHeight           = {33}
                    circleActiveColor   = {circleColor}
                    circleInActiveColor = {circleColor}
                    backgroundInactive  = {COLORS.error[colorMode]}
                    backgroundActive    = {COLORS.success}
                    switchLeftPx        = {2.5}
                    switchRightPx       = {2.5}
                    renderActiveText    = {false}
                    renderInActiveText  = {false}
                />
            </View>
        );
    }
}


export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(Toggle);
