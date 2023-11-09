import React, { PureComponent }   from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes                  from 'prop-types';
import { connect }                from 'react-redux';
import { withTranslation }        from 'react-i18next';

import SiriIcon                   from '../../../assets/static_icons/siri_icon.svg';
import TelegramIcon               from '../../../assets/static_icons/telegram_icon.svg';
import Arrow                      from '../../../assets/static_icons/arrow_right.svg';

import Text                       from '../../ui-kit/Text';

import { isIOS }                  from '../../../utils/platform';
import screens                    from '../../../new-assets/constants/screens';

import style                      from './InstructionsScreenStyles';

class InstructionsScreen extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        route      : PropTypes.object.isRequired,
        colorMode  : PropTypes.string.isRequired,
        t          : PropTypes.func.isRequired
    };

    handleNavigate = (path, params = {}) => () => {
        const { navigation } = this.props;

        navigation.navigate(path, params);
    }

    render() {
        const { colorMode, route, t } = this.props;
        const { shortcuts } = route.params;

        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                {isIOS && (
                    <TouchableOpacity
                        style   = {styles.block}
                        onPress = {this.handleNavigate(screens.ADD_SIRI, { shortcuts })}
                    >
                        <View style={styles.blockLeft}>
                            <SiriIcon />
                            <Text style={styles.title}>{t('Siri')}</Text>
                        </View>

                        <Arrow />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style   = {styles.block}
                    onPress = {this.handleNavigate(screens.INSTRUCTION, { type: 'telegram' })}
                >
                    <View style={styles.blockLeft}>
                        <TelegramIcon />
                        <Text style={styles.title}>{t('Telegram bot')}</Text>
                    </View>

                    <Arrow />
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    null
)(withTranslation()(InstructionsScreen));
