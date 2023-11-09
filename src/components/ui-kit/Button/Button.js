import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { Button }                  from 'react-native-elements';
import { TouchableOpacity }        from 'react-native';

import { debounce }                from '../../../utils';
import COLORS                      from '../../../assets/constants/colors';
import styles                      from './ButtonStyles';

class CustomButton extends PureComponent {
    static propTypes = {
        buttonStyle    : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        containerStyle : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        onPress        : PropTypes.func
    }

    static defaultProps = {
        buttonStyle    : void 0,
        containerStyle : void 0,
        onPress        : void 0
    }

    handlePress = debounce(() => {
        const { onPress } = this.props;

        if (!onPress) return;

        onPress();
    }, 400, true);

    render() {
        const { buttonStyle, containerStyle, onPress, ...rest } = this.props;
        const style = {
            button : [ styles.buttonStyle, buttonStyle  ]
        };

        return (
            <Button
                containerStyle     = {containerStyle}
                buttonStyle        = {style.button}
                TouchableComponent = {TouchableOpacity}
                loadingProps       = {{ color: COLORS.light.TEXT_SECONDARY_LIGHT }}
                onPress            = {onPress ? this.handlePress : void 0}
                {...rest}
            />
        );
    }
}

export default CustomButton;
