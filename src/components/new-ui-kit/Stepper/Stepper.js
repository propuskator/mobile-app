import React            from 'react';
import { connect }      from 'react-redux';
import { View }         from 'react-native';
import PropTypes        from 'prop-types';

import colors           from '../../../new-assets/constants/colors';

import styles           from './StepperStyles';


function Stepper(props) {
    const { steps, currStep, colorMode, stepperStyle } = props;

    const getStepsBgColor = stepIndex => {  // eslint-disable-line func-style
        const circleBgColors = {
            active    : colors[colorMode].PRIMARY,
            notActive : colors[colorMode].GREY_LIGHT
        };

        const currIndex = steps?.indexOf(currStep);

        return currIndex >= stepIndex
            ? circleBgColors.active
            : circleBgColors.notActive;
    };

    return (
        <View style={[ styles.stepperContainer, stepperStyle ]}>
            { steps.map((step, index) => (
                <View
                    key   = {step}
                    style = {{
                        ...styles.stepIndicator,
                        backgroundColor : getStepsBgColor(index)
                    }}
                />
            ))}
        </View>
    );
}

Stepper.propTypes = {
    steps        : PropTypes.array.isRequired,
    currStep     : PropTypes.string.isRequired,
    colorMode    : PropTypes.string.isRequired,
    stepperStyle : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};

Stepper.defaultProps = {
    stepperStyle : void 0
};

export default React.memo(connect(state => ({
    colorMode : state.theme.mode
}), null)(Stepper));
