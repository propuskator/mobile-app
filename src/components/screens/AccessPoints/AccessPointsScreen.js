import React, {
    PureComponent,
    createRef
}                                           from 'react';
import { connect }                          from 'react-redux';
import PropTypes                            from 'prop-types';
import {
    View,
    AppState,
    RefreshControl,
    ActivityIndicator,
    Platform,
    Alert,
    Keyboard,
    TouchableOpacity,
    Pressable
}                                           from 'react-native';
import { withTranslation }                  from 'react-i18next';
import { connectActionSheet }               from '@expo/react-native-action-sheet';

import screens                              from '../../../new-assets/constants/screens';
import * as accessPointsActions             from '../../../actions/accessPoints';
import * as readerGroupsActions             from '../../../actions/readerGroups';

import colors                               from '../../../new-assets/constants/colors';
import { accessPointsSelector }             from '../../../selectors/homie';

import { isAppStateActiveAfterBackground }  from '../../../utils/appState';
import { isIOS }                            from '../../../utils/platform';

import { withNoConnectionMessage }          from '../../hoc/withNoConnectionMessage';
import WithPageBackground                   from '../../hoc/withPageBackground';

import SearchBar                            from '../../new-ui-kit/SearchBar';
import Text                                 from '../../new-ui-kit/Text';
import AppLogo                              from '../../new-ui-kit/AppLogo/AppLogo';
import LoadingBlock                         from '../../new-ui-kit/LoadingBlock';
import Icon                                 from '../../new-ui-kit/Icon';

import GroupsList                           from './GroupsList';
import AccessPointsList                     from './AccessPointsList';

import { filterByName }                     from './utils';
import style                                from './AccessPointsScreenStyles';


class AccessPointsScreen extends PureComponent {
    static propTypes = {
        list                         : PropTypes.array.isRequired,
        getAccessPoints              : PropTypes.func.isRequired,
        isFetching                   : PropTypes.bool.isRequired,
        isUpdating                   : PropTypes.bool.isRequired,
        triggerAccessPoint           : PropTypes.func.isRequired,
        renameAccessPoint            : PropTypes.func.isRequired,
        navigation                   : PropTypes.object.isRequired,
        updateLocalAccessPoints      : PropTypes.func.isRequired,
        fetchReaderGroupInfo         : PropTypes.func.isRequired,
        updateRemoteAccessPoints     : PropTypes.func.isRequired,
        updateGroupAccessPointsOrder : PropTypes.func.isRequired,
        t                            : PropTypes.func.isRequired,
        colorMode                    : PropTypes.string.isRequired,
        hideGroups                   : PropTypes.bool.isRequired,
        getReaderGroupsLogos         : PropTypes.func.isRequired,
        showActionSheetWithOptions   : PropTypes.func.isRequired,
        deleteGroup                  : PropTypes.func.isRequired,
        groups                       : PropTypes.array.isRequired,
        devices                      : PropTypes.object.isRequired,
        isGroupsFetching             : PropTypes.bool.isRequired,
        route                        : PropTypes.shape({
            params : PropTypes.shape({})
        })
    }

    static defaultProps = {
        route : void 0
    }

    constructor(props) {
        super(props);

        this.state = {
            isGroupDataFetching : false,
            groupData           : void 0,
            isRefreshing        : false,
            searchQuery         : '',
            isEditMode          : false,
            isUpdating          : false,
            selectedGroup       : 'all',
            deletingGroups      : [],
            showSearch          : false
        };
        this.appState = 'active';

        // NavigationHelper.initRootNavigator(props.navigation);

        // navigationHelper.initRootNavigator(props.navigation);

        this.groupsListRef = createRef({});
        this.searchRef     = createRef({});
    }

    componentDidMount() {
        const { navigation } = this.props;

        if (!navigation) return;

        AppState.addEventListener('change', this.handleAppStateChange);
        navigation.addListener('focus', this.handleScreenFocus);
        navigation.addListener('blur', this.handleScreenBlur);
        if (isIOS) Keyboard.addListener('keyboardWillHide', this.handleKeyboardHide);
        else Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        if (!navigation) return;

        AppState.removeEventListener('change', this.handleAppStateChange);
        navigation.removeListener('focus', this.handleScreenFocus);
        navigation.removeListener('blur', this.handleScreenBlur);
        if (isIOS) Keyboard.removeListener('keyboardWillHide', this.handleKeyboardHide);
        else Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);

        if (this.updatingTimeout) clearTimeout(this.updatingTimeout);
    }

    handleKeyboardHide = () => {
        this.handleClickOutsideSearch();
    }

    handleScreenBlur = () => {
        this.setState({
            isEditMode  : false,
            searchQuery : '',
            showSearch  : false
        });
    }

    handleScreenFocus = () => {
        const { getAccessPoints, route } = this.props;
        const { selectedId, isCreated, previousScreen } = route?.params || {};
        const { selectedGroup, isEditMode } = this.state;

        if (previousScreen === screens.EDIT_INPUT && isEditMode) return;
        this.fetchData();

        if (selectedId && previousScreen === screens.GROUP) {
            if (selectedId === 'all') getAccessPoints();
            else this.fetchGroupData({ id: selectedId });

            this.setState({ selectedGroup: selectedId }, () => {
                if (isCreated) this.scrollToStart();
            });
        } else if (selectedGroup !== 'all') {
            this.fetchGroupData({ id: selectedGroup });
        }
    }

    scrollToStart = () => {
        if (!this.groupsListRef?.current) return;

        this.groupsListRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

    handleEditGroup = () => {
        const { navigation } = this.props;
        const { groupData } = this.state;

        navigation.navigate(screens.GROUP, {
            id       : groupData?.id,
            itemData : groupData
        });
    }

    deleteGroup = () => {
        const { deleteGroup } = this.props;
        const { selectedGroup } = this.state;

        this.setState({ selectedGroup: 'all' });

        try {
            deleteGroup({ id: selectedGroup });
            this.scrollToStart();
        } catch (error) {
            console.log({ error });
        }
    }

    deleteGroupWithConfirm = () => {
        const { t } = this.props;

        Alert.alert(
            t('Delete group'),
            t('Are you sure you want to delete group?'),
            [
                {
                    text    : t('Yes, delete'),
                    style   : 'destructive',
                    onPress : this.deleteGroup
                },
                { text: t('Cancel'), onPress: () => {} }
            ]
        );
    }

    fetchData = () => {
        const { getAccessPoints, getReaderGroupsLogos } = this.props;

        getAccessPoints();
        getReaderGroupsLogos();
    }

    fetchGroupData = async ({ id, isRefreshing = false } = {}) => {
        const { fetchReaderGroupInfo } = this.props;

        this.setState({ isGroupDataFetching: true, isRefreshing });

        fetchReaderGroupInfo({
            id,
            onSuccess : (groupData) => {
                this.setState({
                    groupData,
                    isGroupDataFetching : false,
                    isRefreshing        : false
                });
            },
            onError : () => {
                this.setState({
                    isGroupDataFetching : false,
                    isRefreshing        : false,
                    selectedGroup       : 'all'
                });
            }
        });
    }

    handleAppStateChange = nextAppState => {
        const { isEditMode } = this.state;

        if (isAppStateActiveAfterBackground(this.appState, nextAppState)) {
            this.fetchData();
        }

        if (isEditMode) {
            this.fetchData();
            this.setState({ isEditMode: false });
        }

        this.appState = nextAppState;
    }

    handleRefresh = async () => {
        const { selectedGroup } = this.state;

        if (selectedGroup !== 'all') {
            return this.fetchGroupData({ id: selectedGroup, isRefreshing: true });
        }

        this.setState({
            isRefreshing : true
        });

        try {
            await this.props.getAccessPoints();
        } finally {
            this.setState({
                isRefreshing : false
            });
        }
    }

    handleCancelSearch = () => {
        this.searchCloseTimeout = setTimeout(() => {
            if (this.state?.searchQuery?.trim()?.length) return;

            this.setState({ searchQuery: '', showSearch: false });
        }, 0);
    }

    handleClickOutsideSearch = () => {
        this.handleCancelSearch();
    }

    handleShowSearch = () => {
        this.setState({ showSearch: true }, () => {
            if (this.searchRef.current) {
                this.searchRef.current.focus();
            }
        });
    }

    handleSelectGroup = (groupId) => () => {
        const { getAccessPoints } = this.props;

        if (groupId !== 'all') {
            this.fetchGroupData({ id: groupId });
        } else getAccessPoints();

        this.setState({
            selectedGroup : groupId,
            isEditMode    : false,
            searchQuery   : '',
            showSearch    : false
        });
    }

    handleSearchChange = searchQuery => this.setState({ searchQuery });

    handleChangeSettingMode = () => {
        const { isEditMode } = this.state;

        if (isEditMode) this.handleSaveConfiguration();
        else this.prepareEditMode();

        this.setState({ isEditMode: !isEditMode });
    }

    handleSaveConfiguration = async () => {
        const {
            updateRemoteAccessPoints,
            updateGroupAccessPointsOrder,
            list
        } = this.props;
        const { selectedGroup, groupData } = this.state;
        const accessPoints = selectedGroup === 'all'
            ? list
            : groupData?.accessTokenReaders;
        const payload = { accessTokenReadersOrder: accessPoints.map(el => el.id) };
        const handler = selectedGroup === 'all'
            ? updateRemoteAccessPoints
            : updateGroupAccessPointsOrder;

        Keyboard.dismiss();

        try {
            clearTimeout(this.updatingTimeout);
            this.updatingTimeout = setTimeout(() => this.setState({ isUpdating: true }), 400);

            await handler(payload, groupData?.id);

            clearTimeout(this.updatingTimeout);
        } finally {
            clearTimeout(this.updatingTimeout);
            this.setState({ isUpdating: false });
        }
    }

    handleUpdateGroupData = (patch) => {
        this.setState({
            groupData : {
                ...(this.state?.groupData || {}),
                ...(patch || {})
            }
        });
    }

    prepareEditMode = () => {
        this.handleSearchChange('');
    };

    renderRefreshControl = ({ isRefreshing } = {}) => {
        const { colorMode } = this.props;

        return (
            <RefreshControl
                refreshing = {isRefreshing}
                onRefresh  = {this.handleRefresh}
                colors     = {[ colors[colorMode].PRIMARY ]}
                tintColor  = {colors[colorMode].PRIMARY}
            />
        );
    }

    renderSpinner = () => {
        const { isUpdating, isFetching, colorMode } = this.props;
        const styles = style(colorMode);
        const { isRefreshing, isGroupDataFetching, groupData, selectedGroup } = this.state;

        const isGroupFetching = isGroupDataFetching
            && ((groupData?.id !== selectedGroup) || !groupData?.accessTokenReaders?.length);

        if (isUpdating || isFetching || isGroupFetching && !isRefreshing) {
            return (
                <LoadingBlock withOverlay blockStyle={styles.loaderWrapper} />
            );
        }
    }

    renderGroups = () => {
        const {
            colorMode, hideGroups, navigation,
            groups, isGroupsFetching
        } = this.props;
        const { selectedGroup } = this.state;
        const styles = style(colorMode);

        if (hideGroups) return null;

        return (
            <View style={styles.groupsWrapper}>
                <GroupsList
                    navigation    = {navigation}
                    onSelectGroup = {this.handleSelectGroup}
                    selectedGroup = {selectedGroup}
                    groups        = {groups}
                    isFetching    = {isGroupsFetching}
                    forwardRef    = {this.groupsListRef}
                    onPress       = {this.handleClickOutsideSearch}
                />
            </View>
        );
    }

    renderAccessPointsList = () => {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <Pressable style={[ styles.accessPointsWrapper ]} onPress={this.handleClickOutsideSearch}>
                <AccessPointsList
                    {...this.props}
                    {...this.state}
                    isFetching           = {this.state.isGroupDataFetching
                        || this.props.isFetching}
                    renderRefreshControl = {this.renderRefreshControl}
                    onRefresh            = {this.handleRefresh}
                    // eslint-disable-next-line  react/jsx-handler-names
                    updateGroupData      = {this.handleUpdateGroupData}
                    onPressAccessPoint   = {this.handleClickOutsideSearch}
                />
                { this.renderSpinner() }
            </Pressable>
        );
    }

    renderSearch = () => {
        const { colorMode, t } = this.props;
        const { searchQuery, selectedGroup, isEditMode } = this.state;
        const styles = style(colorMode);

        if (selectedGroup !== 'all' && !isEditMode) return null;

        return (
            <View style={styles.searchWrapper}>
                <View style={styles.searchView}>
                    <SearchBar
                        platform       = {Platform.OS}
                        onChangeText   = {this.handleSearchChange}
                        value          = {searchQuery}
                        placeholder    = {t('Search')}
                        colorMode      = {colorMode}
                        onCancel       = {this.handleCancelSearch}
                        forwardRef     = {this.searchRef}
                    />
                </View>
            </View>
        );
    }

    renderGroupSettingsIcon = () => {
        const { colorMode } = this.props;
        const { selectedGroup } = this.state;
        const styles = style(colorMode);

        if (selectedGroup === 'all') return null;

        return (
            <Icon
                type    = 'settings'
                style   = {styles.settingsIcon}
                color   = {colors[colorMode].TEXT_PRIMARY}
                size    = {25}
                onPress = {() => {// eslint-disable-line react/jsx-no-bind
                    const { showActionSheetWithOptions, t } = this.props;
                    const options = [
                        t('Edit group'),
                        t('Delete group'),
                        t('Cancel')
                    ];
                    const EDIT_GROUP = 0;
                    const DELETE_GROUP = 1;
                    const CLOSE_MODAL_INDEX = 2;

                    showActionSheetWithOptions(
                        {
                            options,
                            destructiveButtonIndex : 1,
                            cancelButtonIndex      : options.length - 1
                        },
                        index => {
                            switch (index) {
                                case EDIT_GROUP:
                                    this.handleEditGroup();
                                    break;
                                case DELETE_GROUP:
                                    this.deleteGroupWithConfirm();
                                    break;
                                case CLOSE_MODAL_INDEX:
                                    break;

                                default:
                                    break;
                            }
                        }
                    );
                }}
            />
        );
    }

    getAccessPointsList = () => {
        const { selectedGroup, groupData } = this.state;
        const { list } = this.props;

        if (selectedGroup === 'all') return list;
        if (groupData?.id !== selectedGroup) return [];

        return groupData?.accessTokenReaders;
    }

    renderHeading = ({ withEditButton, isEmpty } = {}) => {
        const { colorMode, t, hideGroups } = this.props;
        const { isEditMode, isUpdating, showSearch, selectedGroup } = this.state;
        const styles = style(colorMode);
        const headingStyles  = [ styles.heading, { marginBottom: !hideGroups ? -15 : 5 } ];

        if (showSearch) {
            return (
                <View style={headingStyles}>
                    {this.renderSearch()}
                </View>
            );
        }

        return (
            <View style={headingStyles}>
                <AppLogo style={styles.logoWrapper} />
                <View style={styles.controlsWrapper}>
                    { !isEditMode && selectedGroup === 'all' && !isEmpty
                        ? (
                            <Icon
                                type    = 'search'
                                style   = {styles.searchIcon}
                                color   = {colors[colorMode].TEXT_PRIMARY}
                                onPress = {this.handleShowSearch}
                                size = {20}
                            />
                        ) : null
                    }
                    { withEditButton
                        ? (
                            <View style={styles.editControl}>
                                { !isEditMode && !isUpdating
                                    ? (
                                        <Icon
                                            type    = 'pencil'
                                            style   = {styles.editIcon}
                                            color   = {colors[colorMode].TEXT_PRIMARY}
                                            onPress = {this.handleChangeSettingMode}
                                        />
                                    ) : null
                                }
                                { isUpdating
                                    ? (
                                        <ActivityIndicator
                                            size  = 'small'
                                            color = {colors[colorMode].PRIMARY}
                                        />
                                    ) : null
                                }
                                { isEditMode && !isUpdating
                                    ? (
                                        <TouchableOpacity onPress={this.handleChangeSettingMode}>
                                            <Text
                                                style={{
                                                    fontSize : 15, fontWeight : '600', color : colors[colorMode].GREEN_STRONG
                                                }}
                                            >
                                                {t('Done')}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </View>
                        ) : null
                    }
                </View>
            </View>
        );
    }

    render() {
        const { isFetching, colorMode, list } = this.props;
        const { searchQuery, selectedGroup } = this.state;
        const isNoAccessPoints = !list.length;
        const activeAccessPoints = this.getAccessPointsList();
        const filteredList = searchQuery && selectedGroup === 'all'
            ? filterByName(activeAccessPoints, searchQuery)
            : activeAccessPoints;
        const withEditButton = filteredList?.length && !isFetching;
        const styles = style(colorMode);

        return (
            <WithPageBackground>
                <View style={styles.container}>
                    { this.renderHeading({ withEditButton, isEmpty: !activeAccessPoints?.length }) }

                    { !isFetching
                        ? (
                            <>
                                { !isNoAccessPoints ? this.renderGroups() : null }
                                { this.renderAccessPointsList() }
                            </>
                        )
                        : (
                            <View style={styles.loaderWrapper}>
                                <ActivityIndicator color={colors[colorMode].PRIMARY} size='large' style={styles.spinner} />
                            </View>
                        )
                    }
                </View>
            </WithPageBackground>
        );
    }
}

export default withNoConnectionMessage(connect(
    state => ({
        devices             : state?.homie?.devices || {},
        list                : accessPointsSelector(state),
        isFetching          : state.accessPoints.isFetching,
        isUpdating          : state.accessPoints.isUpdating,
        isInternetReachable : state.connection.isInternetReachable,
        colorMode           : state.theme.mode,
        hideGroups          : state.users.hideGroups,
        groups              : state?.readerGroups?.list,
        isGroupsFetching    : state?.readerGroups?.isFetching
    }),
    {
        ...accessPointsActions,
        ...readerGroupsActions
    }
)(connectActionSheet(withTranslation()(AccessPointsScreen))));
