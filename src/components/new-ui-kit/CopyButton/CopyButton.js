import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import { withTranslation }         from 'react-i18next';
import ReactNativeHapticFeedback   from 'react-native-haptic-feedback';

import clipboard                   from '../../../utils/Clipboard';
import toast                       from '../../../utils/Toast';
import { isAndroid }               from '../../../utils/platform';
import colors                      from '../../../new-assets/constants/colors';
import Icon                        from '../Icon';
import styles                      from './CopyButtonStyles';

class CopyButton extends PureComponent {
    static propTypes = {
        t              : PropTypes.func.isRequired,
        value          : PropTypes.string.isRequired,
        color          : PropTypes.string,
        colorMode      : PropTypes.string.isRequired,
        size           : PropTypes.number,
        containerStyle : PropTypes.object,
        forwardRef     : PropTypes.shape({
            current : PropTypes.shape({})
        }),
        ignoreClick    : PropTypes.bool,
        successMessage : PropTypes.string
    }

    static defaultProps = {
        forwardRef     : void 0,
        size           : 14,
        color          : void 0,
        containerStyle : void 0,
        ignoreClick    : false,
        successMessage : void 0
    }

    constructor(props) {
        super(props);

        if (props.forwardRef && 'current' in props.forwardRef) {
            props.forwardRef.current = {
                copyValue : this.handlePress
            };
        }
    }

    handlePress = () => {
        const { t, value, successMessage } = this.props;

        // light vibration pattern
        const options = {
            enableVibrateFallback       : true,
            ignoreAndroidSystemSettings : true
        };

        ReactNativeHapticFeedback.trigger(isAndroid ? 'impactMedium' : 'impactLight', options);

        clipboard.set(value);
        toast.show(successMessage || t('Data have been successfully copied'));
    }

    render() {
        const { size, colorMode, color, containerStyle, ignoreClick } = this.props;

        const iconColor = color || colors[colorMode].GREEN_ICON_COLOR;

        return (
            <Icon
                color     = {iconColor}
                type      = 'copyIcon'
                onPress   = {!ignoreClick ? this.handlePress : void 0}
                style     = {[ styles.copyButton, containerStyle ]}
                iconStyle = {{ ...styles.copyIcon, height: size, width: size }}
            />
        );
    }
}


export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(CopyButton));

