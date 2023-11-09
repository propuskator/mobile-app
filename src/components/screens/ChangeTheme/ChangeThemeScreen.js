import React, {  PureComponent }    from 'react';
import { View }                     from 'react-native';
import PropTypes                    from 'prop-types';
import { withTranslation }          from 'react-i18next';
import { connect }                  from 'react-redux';

import * as themeActions            from '../../../actions/theme';
import { THEMES }                   from '../../../new-assets/constants/theme';
import { saveThemeValueToStorage }  from '../../../utils/storage/settingsHelper';

import { capitalize }               from '../../../utils';

import TouchableBlock               from '../../new-ui-kit/TouchableBlock';
import Divider                      from '../../new-ui-kit/Divider';
import StatusBar                    from '../../new-ui-kit/StatusBar';

import style                        from './ChangeThemeScreenStyles';

class ChangeThemeScreen extends PureComponent {
    static propTypes = {
        colorMode        : PropTypes.string.isRequired,
        updateThemeValue : PropTypes.func.isRequired,
        t                : PropTypes.func.isRequired
    };

    handleChangeTheme = ({ colorMode } = {}) => () => {
        const { updateThemeValue } = this.props;

        saveThemeValueToStorage(colorMode);
        updateThemeValue(colorMode);
    }

    render() {
        const { colorMode:selectedColorMode, t } = this.props;

        const styles = style(selectedColorMode);

        return (
            <View style = {styles.contentContainer}>
                <StatusBar color='white' withHeight={false} />
                { THEMES?.map(
                    ({ title, colorMode, isSystem }, index) => (
                        <>
                            <TouchableBlock
                                key            = {title}
                                color          = 'greyLight'
                                title          = {t(capitalize(title))}
                                onClick        = {this.handleChangeTheme({ title, colorMode, isSystem })}
                                value          = {colorMode === selectedColorMode}
                                containerStyle = {styles.themeContainer}
                                titleStyle     = {[
                                    styles.title,
                                    colorMode === selectedColorMode  ? styles.selectedTitle : {}
                                ]}
                                withArrow     = {false}
                                withRadio
                                isTransparent
                            />
                            { index !== THEMES?.length - 1
                                ? <Divider variant ='dark' />
                                : null
                            }
                        </>
                    ))
                }
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    { ...themeActions }
)(withTranslation()(ChangeThemeScreen));
