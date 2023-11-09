import React, { PureComponent }                   from 'react';
import PropTypes                                  from 'prop-types';
import { connect }                                from 'react-redux';
import { View, TouchableOpacity }                 from 'react-native';
import { withTranslation }                        from 'react-i18next';

import Text                                       from '../Text';
import ArrowBottomIcon                            from '../../../assets/static_icons/arrow_select_bottom.svg';
import GlobalIcon                                 from '../../../assets/static_icons/global.svg';
import { LANGUAGES }                              from '../../../assets/constants/languages';

import screens                                    from '../../../new-assets/constants/screens';

import style                                      from './LanguageSelectStyles.js';


class LanguageSelect extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        i18n       : PropTypes.object.isRequired,
        colorMode  : PropTypes.string.isRequired
    }

    handleNavigate = path => () => {
        const { navigation } = this.props;

        navigation.navigate(path);
    }

    render() {
        const { colorMode, i18n: { language } } = this.props;
        const languageTitle = LANGUAGES.find(lang => lang.languageTag === language)?.languageTag?.toUpperCase();

        const styles = style(colorMode);

        return (
            <TouchableOpacity
                style   = {[ styles.container ]}
                onPress = {this.handleNavigate(screens.CHANGE_LANGUAGE)}
            >
                <View style={styles.languageWrapper}>
                    <GlobalIcon style={styles.globalIcon} />
                    <Text style={styles.language}>
                        {languageTitle}
                    </Text>
                    <ArrowBottomIcon style={styles.arrowIcon} />
                </View>
            </TouchableOpacity>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    null
)(withTranslation()(LanguageSelect));
