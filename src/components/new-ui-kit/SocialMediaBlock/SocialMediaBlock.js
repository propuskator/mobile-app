import React, { PureComponent }                 from 'react';
import PropTypes                                from 'prop-types';
import { View }                                 from 'react-native';
import { connect }                              from 'react-redux';
import { TouchableOpacity }                     from 'react-native-gesture-handler';
import { withTranslation }                      from 'react-i18next';

import FacebookDark                             from '../../../new-assets/icons/social/facebook_dark.svg';
import FacebookLight                            from '../../../new-assets/icons/social/facebook_light.svg';
import GoogleDark                               from '../../../new-assets/icons/social/google_dark.svg';
import GoogleLight                              from '../../../new-assets/icons/social/google_light.svg';
import AppleDark                                from '../../../new-assets/icons/social/apple_dark.svg';
import AppleLight                               from '../../../new-assets/icons/social/apple_light.svg';

import { isIOS }                                from '../../../utils/platform';

import * as sessionActions                      from '../../../actions/session';

import style                                    from './SocialMediaBlockStyles';

class SocialMediaBlock extends PureComponent {
    static propTypes = {
        colorMode           : PropTypes.string.isRequired,
        facebookLogin       : PropTypes.func.isRequired,
        googleLogin         : PropTypes.func.isRequired,
        appleIdLogin        : PropTypes.func.isRequired,
        isEnableAppleSignIn : PropTypes.bool
    }

    static defaultProps = {
        isEnableAppleSignIn : isIOS
    }

    handleFBLogin=() => {
        const { facebookLogin } = this.props;

        facebookLogin();
    }


    handleGoogleSignIn = async () => {
        const { googleLogin } = this.props;

        googleLogin();
    };


    handleAppleSignIn = async () => {
        const { appleIdLogin } = this.props;

        appleIdLogin();
    }

    render() {
        const { colorMode, isEnableAppleSignIn } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.socialMedia}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress= {this.handleFBLogin}
                >
                    {colorMode === 'light' ?  <FacebookLight /> : <FacebookDark />}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleGoogleSignIn}
                >
                    {colorMode === 'light' ?  <GoogleLight /> : <GoogleDark />}
                </TouchableOpacity>

                { isEnableAppleSignIn &&
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.handleAppleSignIn}
                    >
                        {colorMode === 'light' ?  <AppleLight /> : <AppleDark />}
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

export default connect(
    state => ({
        isSendBoxEnabled : state.session.isSendBoxEnabled,
        colorMode        : state.theme.mode
    }),
    {
        ...sessionActions
    }
)(withTranslation()(SocialMediaBlock));
