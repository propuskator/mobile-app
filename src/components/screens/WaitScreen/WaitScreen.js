import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { View }                    from 'react-native';
import { withTranslation }         from 'react-i18next';

import { connect }                 from 'react-redux';

import screens                     from '../../../new-assets/constants/screens';
import EmailLight                  from '../../../new-assets/images/PicEmailLight.svg';
import EmailDark                   from '../../../new-assets/images/PicEmailDark.svg';
import Button                      from '../../new-ui-kit/Button';
import Text                        from '../../new-ui-kit/Text';
import StatusBar                   from '../../new-ui-kit/StatusBar';

import sessionManager              from '../../../SessionManager';

import * as usersActions           from '../../../actions/users';
import * as linkingActions         from '../../../actions/linking';

import Heading                     from '../Login/Heading';

import style                       from './WaitScreenStyles';

class WaitScreen extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        colorMode  : PropTypes.object.isRequired,
        t          : PropTypes.object.isRequired
    }

    handleNavigateToLogin = () => {
        const { navigation } = this.props;
        const activeUser =  sessionManager.getActiveUser();
        const isUserAuthenticated = activeUser?.isAuthenticated;

        if (isUserAuthenticated)  navigation.navigate(screens.SETTINGS);
        else navigation.navigate(screens.LOGIN);
    }

    render() {
        const { colorMode, t  } = this.props;
        const styles = style(colorMode);

        const PictureComponent = colorMode === 'light' ? EmailLight : EmailDark;

        return (
            <View style={styles.mainWrapper}>
                <StatusBar color='white' />
                <Heading
                    colorMode = {colorMode}
                />
                <View style = {styles.container}>
                    <PictureComponent />
                    <View style={styles.description}>
                        <Text style={[ styles.title, styles.text ]}>
                            {t('Thank you, your request has been sent!')}
                        </Text>
                        <Text style={[ styles.description, styles.text ]}>
                            {t('After confirmation, you will receive a notification by email')}
                        </Text>
                    </View>
                </View>
                <View style = {styles.footer}>
                    <Button
                        title   = {t('OK')}
                        onPress = {this.handleNavigateToLogin}
                    />
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode      : state.theme.mode,
        deepLinkUrl    : state.linking.deepLinkUrl,
        deepLinkParams : state.linking.deepLinkParams
    }),
    {
        ...usersActions,
        ...linkingActions
    }
)(withTranslation()(WaitScreen));
