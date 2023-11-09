import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { SearchBar }               from 'react-native-elements';
import { withTranslation }         from 'react-i18next';

import colors                      from '../../../assets/constants/colors';
import style                       from './SearchBarStyles';

class CustomSearchBar extends PureComponent {
    static propTypes = {
        colorMode      : PropTypes.string,
        t              : PropTypes.func.isRequired,
        containerStyle : PropTypes.object
    }

    static defaultProps = {
        colorMode      : 'light',
        containerStyle : {}
    };

    render() {
        const { colorMode, t } = this.props;
        const styles = style(colorMode);
        const barStyles = {
            containerStyle      : [ styles.containerStyle, this.props.containerStyle ],
            inputContainerStyle : { ...styles.inputContainerStyle },
            inputStyle          : { ...styles.inputStyle }
        };

        return (
            <SearchBar
                {...this.props}
                {...barStyles}
                cancelButtonTitle  = {t('Cancel')}
                allowFontScaling   = {false}
                cancelButtonProps  = {{ allowFontScaling: false }}
                cancelButtonStyles = {{ color: colors[colorMode].TEXT_SECONDARY }}
                labelProps         = {{ allowFontScaling: false }}
                containerStyle     = {barStyles.containerStyle}
                keyboardAppearance = {colorMode}
            />
        );
    }
}

export default withTranslation()(CustomSearchBar);
