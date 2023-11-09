import React, {
    PureComponent
}                               from 'react';
import {
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    ActivityIndicator
}                               from 'react-native';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import { withTranslation }      from 'react-i18next';

import {
    checkIsBiometrySupported,
    getBiometryType
}                               from '../../../../utils/TouchId';
import sessionManager           from '../../../../SessionManager';
import * as userActions         from '../../../../actions/users';
import * as sessionActions      from '../../../../actions/session';
import { wh }                   from '../../../../utils/platform';

import colors                   from '../../../../new-assets/constants/colors';
import screens                  from '../../../../new-assets/constants/screens';

import Icon                     from '../../../new-ui-kit/Icon';
import Divider                  from '../../../new-ui-kit/Divider';
import UserDataBlock            from '../../../new-ui-kit/UserDataBlock';
import Text                     from '../../../new-ui-kit/Text';
import Modal                    from '../../../new-ui-kit/Modal';

import style                    from './AccountsModalStyles';

class AccountsModal extends PureComponent {
    static propTypes = {
        colorMode     : PropTypes.string.isRequired,
        onDismiss     : PropTypes.func.isRequired,
        logout        : PropTypes.func.isRequired,
        isVisible     : PropTypes.bool.isRequired,
        isSwitching   : PropTypes.bool.isRequired,
        switchAccount : PropTypes.func.isRequired,
        navigation    : PropTypes.object.isRequired,
        t             : PropTypes.func.isRequired,
        name          : PropTypes.string.isRequired
    };

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        this.state = {
            list       : sessionManager.getSessions(),
            activeUser : sessionManager.getActiveUser()
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const isBiometrySupported = await checkIsBiometrySupported();
        const biometryType = await getBiometryType();

        navigation.addListener('focus', this.handleUpdateState);

        this.setState({
            isBiometrySupported,
            biometryType
        });
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('focus', this.handleUpdateState);
    }

    handleUpdateState = () => {
        const activeUser = sessionManager.getActiveUser();
        const list = sessionManager.getSessions();

        this.setState({
            activeUser,
            list
        });
    }

    handleSwitchAccount = ({ id, url, workspace }) => async ()  => {
        const { switchAccount } = this.props;

        try {
            await switchAccount({
                id,
                url,
                workspace,
                onSuccess : this.handleUpdateState,
                onError   : this.handleUpdateState
            });
        } catch (err) {
            console.log(err);
        }
    }


    handleUserSelect = ({ id, url, workspace }) => async () => {
        const { t } = this.props;

        Alert.alert(
            '',
            t('SwitchAccountConfirmatiom', { workspace }),
            [
                {
                    text    : t('Yes'),
                    onPress : this.handleSwitchAccount({ id, url, workspace })
                },
                {
                    text : t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }

    handleDeletePress = ({ url, id, workspace, email } = {}) => () => {
        const { t } = this.props;

        Alert.alert(
            t('Logout alert title', { workspace }),
            t('Are you sure you want to log out?', { email }),
            [
                {
                    text    : t('Yes, log out'),
                    style   : 'destructive',
                    onPress : this.handleDeleteUser({ url, id })
                },
                {
                    text : t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }

    handleDeleteUser = ({ url, id }) => async () => {
        const { logout } = this.props;
        const { id: userId } = sessionManager.getActiveUser();
        const isDeletingActiveUser = userId === id;

        if (isDeletingActiveUser) {
            await logout();
        } else {
            sessionManager.removeUser({ url, id });
            this.handleUpdateState();
        }
    }

    setNextActiveUsser = async id => {
        const { list } = this.state;
        const deletingUserIndex = list.findIndex(el => el.id === id);
        const nextActiveUser = list[deletingUserIndex + 1] || list[deletingUserIndex - 1];

        sessionManager.setActiveUser({ ...nextActiveUser });
        this.handleUpdateState();
    }

    renderUserDataBlock = ({ item }) => {
        const { colorMode } = this.props;
        const {
            workspace,
            url,
            email,
            avatarUrl,
            id
        } = item;
        const isUserChacked = id === this.state?.activeUser?.id;
        const styles = style(colorMode);

        return (
            <>
                <UserDataBlock
                    style          = {styles.accountBlock}
                    userId         = {id}
                    workspace      = {workspace}
                    email          = {email}
                    serverUrl      = {url}
                    avatarUrl      = {avatarUrl}
                    colorMode      = {colorMode}
                    isUserChacked  = {isUserChacked}
                    onItemPress    = {this.handleUserSelect({ id, url, workspace })}
                    onDeleteItem   = {this.handleDeletePress({ workspace, url, id, email })}
                    icon           = {
                        isUserChacked ? (
                            <Icon
                                type  = {'successCircleFilled'}
                                size  = {25}
                                color = {'#4AB867'}
                                fill1 = {'#FFF'}
                            />
                        ) : null
                    }
                />
                {<Divider containerStyle={styles.divider} />}
            </>
        );
    }

    handleNavigateToLogin = () => {
        const { navigation, isSwitching, onDismiss } = this.props;

        if (!isSwitching) {
            onDismiss();
            navigation.push(screens.LOGIN, { withBackIcon: true });
        }
    }

    getModalHeight = () => {
        const { list } = this.state;

        if (list?.length < 4) return 470;

        return wh * 0.9;
    }

    render() {
        const {
            colorMode, onDismiss, isVisible, t,
            name, isSwitching
        } = this.props;
        const { list } = this.state;
        const styles = style(colorMode);

        return (
            <Modal
                height        = {this.getModalHeight()}
                header        = {name}
                visible       = {isVisible}
                colorMode     = {colorMode}
                onDismiss     = {onDismiss}
                withKeyboard
                withCloseIcon
            >
                <View style={styles.contentContainer}>
                    <View style={styles.listWrapper}>
                        <FlatList
                            data                  = {list}
                            renderItem            = {this.renderUserDataBlock}
                            style                 = {styles.scroll}
                            contentContainerStyle = {styles.accoutsContainer}
                        />
                    </View>
                    <TouchableOpacity
                        style    = {[ styles.addAccountButton ]}
                        onPress = {this.handleNavigateToLogin}
                    >
                        <View style={styles.addIconWrapper}>
                            <Icon
                                style = {styles.addIcon}
                                type  = {'add'}
                                size  = {25}
                                color = {colors[colorMode].PRIMARY}
                            />
                        </View>
                        <Text style={styles.addText}>{t('Add account')}</Text>
                    </TouchableOpacity>
                    { isSwitching
                        ? (
                            <View style={styles.loaderWrapper}>
                                <ActivityIndicator
                                    style = {styles.loader}
                                    size  = 'large'
                                    color = {colors[colorMode].PRIMARY}
                                />
                            </View>
                        ) : null
                    }
                </View>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        isSwitching         : state.users.isSwitching,
        isInternetReachable : state.connection.isInternetReachable,
        colorMode           : state.theme.mode
    }),
    {
        ...userActions,
        ...sessionActions
    }
)(withTranslation()(AccountsModal));
