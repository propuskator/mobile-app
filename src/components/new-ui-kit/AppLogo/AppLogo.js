import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import { withTranslation }      from 'react-i18next';
import { View }                 from 'react-native';

import LogoRu                   from '../../../new-assets/icons/logo-ru.svg';
import LogoEn                   from '../../../new-assets/icons/logo-en.svg';

import { withIconDefaultTheme } from '../../hoc/withIconDefaultTheme';

import colors                   from '../../../new-assets/constants/colors';

import styles                   from './AppLogoStyles';

class AppLogo extends PureComponent {
    static propTypes = {
        i18n      : PropTypes.object.isRequired,
        style     : PropTypes.object,
        colorMode : PropTypes.string.isRequired
    };

    static defaultProps = {
        style : {}
    };

    renderLogo = () => {
        const { style, i18n: { language }, colorMode, ...restProps } = this.props;

        const icons = {
            en : LogoEn,
            ru : LogoRu,
            uk : LogoRu
        };

        const LogoIcon = withIconDefaultTheme(icons[language || 'en'], true);

        return (
            <LogoIcon
                style  = {style}
                color  = {colors[colorMode].TEXT_PRIMARY}
                height = {27}
                {...restProps}
            />
        );
    }

    render() {
        return (
            <View style = {[ styles.logoWrapper, this.props?.style ]}>
                {this.renderLogo()}
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(AppLogo));

