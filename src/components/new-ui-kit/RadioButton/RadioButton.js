import React            from 'react';
import PropTypes        from 'prop-types';
import { connect }      from 'react-redux';
import {
    TouchableOpacity,
    View
}                       from 'react-native';

import style            from './RadioButtonStyles';

function RadioButton(props) {
    const { isChecked, value, onPress, colorMode, containerStyle } = props;

    function handlePress() {
        if (onPress && !isChecked) onPress({ value });
    }

    const styles = style(colorMode);

    return (
        <TouchableOpacity
            disabled = {!onPress}
            onPress  = {handlePress}
            style    = {[ styles.container, containerStyle ]}
        >
            <View style={[ styles.outerRing, isChecked ? styles.checked : null ]}>
                {
                    isChecked
                        ? <View style={styles.innerRing} />
                        : null
                }
            </View>
        </TouchableOpacity>
    );
}

RadioButton.propTypes = {
    isChecked      : PropTypes.bool.isRequired,
    value          : PropTypes.string,
    onPress        : PropTypes.func,
    containerStyle : PropTypes.object,
    colorMode      : PropTypes.string.isRequired
};

RadioButton.defaultProps = {
    containerStyle : undefined,
    onPress        : undefined,
    value          : ''
};

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(RadioButton);
