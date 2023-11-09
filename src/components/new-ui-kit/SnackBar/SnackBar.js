import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import Animated, { Value, Easing } from 'react-native-reanimated';

import colors                      from '../../../new-assets/constants/colors';
import Text                        from '../Text';
import style                       from './SnackBarStyles';

const DURATION = 200;
const INITIAL_POSITION = -100;

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

    backgroundColors = () => {
        const { colorMode } = this.props;

        return {
            error   : colors.ERROR_LIGHT,
            info    : colors[colorMode].PRIMARY,
            success : colors[colorMode].SUCCESS
        };
    };

    render() {
        const { type, message, colorMode } = this.props;
        const bgColors = this.backgroundColors();

        const styles = style(colorMode);

        return (
            <Animated.View
                style = {{
                    ...styles.container,
                    marginTop : this.topValue,
                    ...(type && { backgroundColor: bgColors[type] })
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
