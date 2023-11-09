import React, {  PureComponent }    from 'react';
import { View }                     from 'react-native';
import PropTypes                    from 'prop-types';
import { withTranslation }          from 'react-i18next';
import { connect }                  from 'react-redux';

import { LANGUAGES }                from '../../../assets/constants/languages';

import { setLanguageToStorage }     from '../../../utils/storage/settingsHelper';

import TouchableBlock               from '../../new-ui-kit/TouchableBlock';
import Divider                      from '../../new-ui-kit/Divider';

import style                        from './ChangeLanguageScreenStyles';

class ChangeLanguageScreen extends PureComponent {
    static propTypes = {
        i18n      : PropTypes.object.isRequired,
        colorMode : PropTypes.string.isRequired
    };

    handleChangeLanguage = (lang) => () => {
        const { i18n } = this.props;

        setLanguageToStorage(lang);
        i18n.changeLanguage(lang);
    }

    render() {
        const { i18n:{ language }, colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <View style = {styles.contentContainer}>
                {
                    LANGUAGES.map(
                        ({ title, subTitle, languageTag }, index) =>
                            (<>
                                <TouchableBlock
                                    key           = {languageTag}
                                    title         = {title}
                                    subtitle      = {subTitle}
                                    color         = 'greyLight'
                                    titleStyle    = {[ styles.title, languageTag === language && styles.selectedTitle ]}
                                    subtitleStyle = {styles.subtitle}
                                    onClick       = {this.handleChangeLanguage(languageTag)}
                                    value         = {languageTag === language}
                                    withArrow     = {false}
                                    withRadio
                                    isTransparent
                                />
                                { index !== LANGUAGES?.length - 1
                                    ? <Divider variant ='dark' />
                                    : null
                                }
                            </>)
                    )
                }
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    null
)(withTranslation()(ChangeLanguageScreen));
