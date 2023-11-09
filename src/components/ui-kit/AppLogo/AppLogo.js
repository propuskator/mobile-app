import React, { PureComponent } from 'react';
import { View }                 from 'react-native';
import PropTypes                from 'prop-types';
import { withTranslation }      from 'react-i18next';

import LogoRu                   from '../../../assets/icons/logo_ru.svg';
import LogoEn                   from '../../../assets/icons/logo_en.svg';

import { withIconDefaultTheme } from '../../hoc/withIconDefaultTheme';

import styles                   from './AppLogoStyles';

class AppLogo extends PureComponent {
    static propTypes = {
        i18n  : PropTypes.object.isRequired,
        style : PropTypes.object
    };

    static defaultProps = {
        style : {}
    };

    renderLogo = () => {
        const { style, i18n: { language } } = this.props;

        const icons = {
            en : LogoEn,
            ru : LogoRu,
            uk : LogoRu
        };

        const LogoIcon = withIconDefaultTheme(icons[language || 'en'], true);

        return (
            <LogoIcon style={style} />
        );
    }

    render() {
        return (
            <View style = {styles.logoWrapper}>
                {this.renderLogo()}
            </View>
        );
    }
}

export default withTranslation()(AppLogo);
