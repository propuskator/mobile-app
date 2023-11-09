import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import Animated, { Value, Easing } from 'react-native-reanimated';

import Text                        from '../../ui-kit/Text';
import colors                      from '../../../assets/constants/colors';
import style                       from './SnackBarStyles';

const DURATION = 200;
const INITIAL_POSITION = -100;

function backgroundColors(colorMode) {
    return {
        error   : colors[colorMode].ERROR,
        info    : colors[colorMode].PRIMARY,
        success : colors[colorMode].SUCCESS
    };
}

class SnackBar extends PureComponent {
    static propTypes = {
        type      : PropTypes.oneOf([ 'info', 'success', 'error', '' ]),
        message   : PropTypes.string,
        colorMode : PropTypes.string.isRequired
    }

    static defaultProps = {
        type    : 'error',
        message : ''
    }

    constructor(props) {
        super(props);

        this.topValue = new Value(INITIAL_POSITION);
    }

    componentDidUpdate(prevProps) {
        const { message } = this.props;
        const isOpened = !prevProps.message && message;
        const isDismissed = prevProps.message && !message;

        if (isOpened || isDismissed) {
            Animated.timing(
                this.topValue,
                {
                    toValue  : isOpened ? 0 : INITIAL_POSITION,
                    duration : DURATION,
                    easing   : Easing.inOut(Easing.ease)
                }
            ).start();
        }
    }

    render() {
        const { type, message, colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <Animated.View
                style = {{
                    ...styles.container,
                    marginTop : this.topValue,
                    ...(type && { backgroundColor: backgroundColors(colorMode)[type] })
                }}
                pointerEvents= 'none'
            >
                <Text style = {styles.text}>
                    {message}
                </Text>
            </Animated.View>
        );
    }
}

export default connect(
    state => ({
        type      : state.snackbar.type,
        message   : state.snackbar.message,
        colorMode : state.theme.mode
    })
)(SnackBar);
