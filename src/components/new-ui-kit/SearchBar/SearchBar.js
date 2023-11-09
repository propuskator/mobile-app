import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { withTranslation }         from 'react-i18next';
import { SearchBar }               from 'react-native-elements';

import {
    allowFontScaling as platformAllowFontScaling
}                                  from '../../../utils/platform';

import colors                      from '../../../new-assets/constants/colors';

import style                       from './SearchBarStyles';

class CustomSearchBar extends PureComponent {
    static propTypes = {
        colorMode        : PropTypes.string,
        containerStyle   : PropTypes.object,
        t                : PropTypes.func.isRequired,
        forwardRef       : PropTypes.object,
        onCancel         : PropTypes.func,
        allowFontScaling : PropTypes.bool
    }

    static defaultProps = {
        colorMode        : 'light',
        containerStyle   : {},
        forwardRef       : void 0,
        onCancel         : void 0,
        allowFontScaling : void 0
    };

    render() {
        const {
            allowFontScaling:allowFontScalingFromProps,
            colorMode,
            containerStyle,
            t,
            forwardRef,
            onCancel
        } = this.props;
        const styles = style(colorMode);

        const allowFontScaling = [ true, false ]?.includes(allowFontScalingFromProps)
            ? allowFontScalingFromProps
            : platformAllowFontScaling;

        return (
            <SearchBar
                {...this.props}
                ref                  = {forwardRef}
                containerStyle       = {[ styles.containerStyle, containerStyle ]}
                inputContainerStyle  = {[ styles.inputContainerStyle ]}
                inputStyle           = {[ styles.inputStyle ]}
                cancelButtonStyles   = {[ styles.cancelButtonStyles ]}
                cancelButtonProps    = {styles.cancelButtonProps}
                onCancel             = {onCancel}
                allowFontScaling     = {allowFontScaling}
                cancelIcon           = {styles.cancelButtonStyles}
                searchIcon           = {styles.cancelButtonStyles}
                clearIcon            = {styles.cancelButtonStyles}
                labelProps           = {{ allowFontScaling }}
                keyboardAppearance   = {colorMode}
                cancelButtonTitle    = {t('Cancel')}
                placeholderTextColor = {colors[colorMode].SEARCH_BAR}
            />
        );
    }
}

export default withTranslation()(CustomSearchBar);
