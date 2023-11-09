import React, { PureComponent }          from 'react';
import PropTypes                         from 'prop-types';
import {
    View,
    Alert
}                                        from 'react-native';
import { connect }                       from 'react-redux';
import { withTranslation }               from 'react-i18next';

import * as usersActions                 from '../../../actions/users';

import colors                            from '../../../new-assets/constants/colors';
import Button                            from '../../new-ui-kit/Button';
import TouchableBlock                    from '../../new-ui-kit/TouchableBlock';
import Divider                           from '../../new-ui-kit/Divider';

import screens                           from '../../../new-assets/constants/screens';
import style                             from './AccountSettingsScreenStyles';

class AccountSettingsScreen extends PureComponent {
    static propTypes = {
        colorMode         : PropTypes.string.isRequired,
        t                 : PropTypes.func.isRequired,
        removeUserAccount : PropTypes.func.isRequired,
        navigation        : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading : false
        };
    }

    handleNavigate = path => () => {
        const { navigation } = this.props;

        navigation.navigate(path);
    }

    handleDelete = async () => {
        const { removeUserAccount } = this.props;

        this.setState({ isLoading: true });
        await removeUserAccount();
        this.setState({ isLoading: false });
    }

    handleDeleteError = () => {}

    handleDeleteButtonPress = () => {
        const { t } = this.props;

        Alert.alert(
            t('Delete account'),
            t('Are you sure you want to delete your account?'),
            [
                {
                    text    : t('Yes, delete'),
                    onPress : this.handleDelete
                },
                {
                    text : t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }

    render() {
        const { isLoading } = this.state;
        const { colorMode, t } = this.props;
        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.blocksContainer}>
                        <TouchableBlock
                            title         = {t('Change password')}
                            titleStyle    = {[ styles.title ]}
                            onClick       = {this.handleNavigate(screens.CHANGE_PASS)}
                        />
                        <Divider variant ='dark' />
                    </View>
                    <View style={styles.footer}>
                        <Button
                            titleStyle   = {styles.deleteBtnTitle}
                            onPress     = {this.handleDeleteButtonPress}
                            title       = {t('Delete account')}
                            loading     = {isLoading}
                            type         = 'clear'
                            loadingProps = {{ color: colors[colorMode].PRIMARY }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    { ...usersActions }
)(withTranslation()(AccountSettingsScreen));
