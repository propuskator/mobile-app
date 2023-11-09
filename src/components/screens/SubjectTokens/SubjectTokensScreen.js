import React, {
    PureComponent,
    createRef
}                               from 'react';
import { withTranslation }      from 'react-i18next';
import {
    View,
    Platform,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Pressable,
    Keyboard,
    Image
}                               from 'react-native';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import colors                   from '../../../new-assets/constants/colors';
import * as subjectTokenActions from '../../../actions/subjectTokens';
import {
    validateAttachSubjectToken
}                               from '../../../utils/validation';
import EditInputModal           from '../../modals/InputModal';
import { withKeyboardEvents }   from '../../hoc/withKeyboardEvents';
import SearchBar                from '../../new-ui-kit/SearchBar';
import Text                     from '../../new-ui-kit/Text';
import BorderedBlock            from '../../new-ui-kit/BorderedBlock';
import Icon                     from '../../new-ui-kit/Icon';
import Button                   from '../../new-ui-kit/Button';

import PicNoTokensLight         from '../../../new-assets/images-png/PicNoTokens.png';
import PicNoTokensDark          from '../../../new-assets/images-png/PicNoTokensDark.png';
import PicEmptySearchLight      from '../../../new-assets/images-png/PicEmptySearch.png';
import PicEmptySearchDark       from '../../../new-assets/images-png/PicEmptySearchDark.png';
import {
    isIOS
}                               from '../../../utils/platform';
import Toast                    from '../../../utils/Toast';

import ActionsModal             from './ActionsModal';
import style                    from './SubjectTokensScreenStyles';

function filterByName(list, searchQuery) {
    return list.filter(access => access.name.toLowerCase().includes(searchQuery.toLowerCase()));
}

const hitslop = { top: 5, bottom: 5, left: 5, right: 5 };

class SubjectTokensScreen extends PureComponent {
    static propTypes = {
        navigation       : PropTypes.object.isRequired,
        list             : PropTypes.array.isRequired,
        colorMode        : PropTypes.string.isRequired,
        getSubjectTokens : PropTypes.func.isRequired,
        detachToken      : PropTypes.func.isRequired,
        attachToken      : PropTypes.func.isRequired,
        updateTokenState : PropTypes.func.isRequired,
        t                : PropTypes.func.isRequired,
        isProcessing     : PropTypes.bool.isRequired,
        cheskPermission  : PropTypes.func.isRequired,
        canAttachTokens  : PropTypes.bool.isRequired,
        keyboardHeight   : PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            searchQuery     : '',
            isRefreshing    : false,
            showCreateModal : false
        };
        this.modalRef = createRef();
    }

    componentDidMount() {
        const { navigation } = this.props;

        this.setHeaderOptions();
        navigation.addListener('focus', this.handleScreenFocus);
    }

    componentDidUpdate(prevProps) {
        const prevCanAttachTokens = prevProps.canAttachTokens;
        const prevList = prevProps?.list;
        const { canAttachTokens, list } = this.props;
        const shoudUpdateHeader = canAttachTokens !== prevCanAttachTokens
            || list?.length !== prevList?.length;

        if (shoudUpdateHeader) {
            this.setHeaderOptions();
        }
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('focus', this.handleScreenFocus);
    }

    setHeaderOptions = () => {
        const { canAttachTokens, navigation, colorMode, list } = this.props;
        const styles = style(colorMode);

        navigation.setOptions({
            headerRight : () => canAttachTokens && !!list?.length
                ? (
                    <TouchableOpacity
                        style   = {styles.headerOptionsIcon}
                        onPress = {this.handleOpenCreateModal}
                        hitSlop = {hitslop}
                    >
                        <Icon type='add' size={24} />
                    </TouchableOpacity>
                ) : null
        });
    }

    handleScreenFocus = () => {
        this.handleRefresh({ isRefreshing: false });
    }

    handleCreateToken = ({ value, onSuccess, onError } = {}) => {
        validateAttachSubjectToken({
            data      : { id: value },
            onSuccess : (data) => {
                try {
                    this.createToken({ data, onSuccess, onError });
                } catch (error) {
                    if (onError) onError();
                }
            },
            onError : errors => {
                if (onError) onError({ value: errors?.id });
            }
        });
    }

    createToken = ({ data, onSuccess, onError }) => {
        const { attachToken } = this.props;
        const payload = { id: data?.id };

        attachToken({
            payload,
            onSuccess,
            onError : errors => {
                if (onError) onError({ value: errors?.message });
            }
        });
    }

    handleRefresh = async ({ isRefreshing = true } = {}) => {
        this.setState({
            isRefreshing
        });

        try {
            const { getSubjectTokens, cheskPermission } = this.props;

            await Promise.all([ getSubjectTokens(), cheskPermission() ]);
        } catch (error) {
            console.log({ error });
        } finally {
            this.setState({
                isRefreshing : false
            });
        }
    }

    handleDetachToken = (item) => {
        const { t } = this.props;

        Alert.alert(
            t('Delete tag'),
            t('Are you sure you want to delete this tag?'),
            [
                {
                    text    : t('Yes, delete'),
                    style   : 'destructive',
                    onPress : this.handleDelete(item.id)
                },
                {
                    text : t('Cancel')
                }
            ],
            { cancelable: true }
        );
    }

    handleOpenActionsModal = entity => () => {
        this.modalRef.current?.openModal(entity);
    }

    handleChangeTokenState = item => {
        const { enabled, id } = item;

        if (enabled) {
            this.handleDisable(id);

            return;
        }

        this.handleEnable(id);
    }

    handleDelete = id => () => {
        const { detachToken } = this.props;

        detachToken(id);
    }

    handleEnable = id => {
        const { updateTokenState } = this.props;

        updateTokenState(id, true);
    }

    handleDisable = id => {
        const { updateTokenState } = this.props;

        updateTokenState(id, false);
    }

    handleOpenCreateModal = () => {
        this.setState({ showCreateModal: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ showCreateModal: false });
    }

    handleSearchChange = value => {
        this.setState({ searchQuery: value });
    }

    handleTagLongPress = name => () => Toast.show(name);

    handleClickOutsideSearch = () => {
        Keyboard.dismiss();
    }

    getEmptyIcon = ({ isEmptyMessageBySearch, colorMode } = {}) => {
        if (isEmptyMessageBySearch) {
            return colorMode === 'light' ? PicEmptySearchLight : PicEmptySearchDark;
        }

        return colorMode === 'light' ? PicNoTokensLight : PicNoTokensDark;
    }

    renderEmptyDescription = (isEmptyMessageBySearch) => {
        const { searchQuery } = this.state;
        const { colorMode, t, canAttachTokens, keyboardHeight } = this.props;
        const EmptyIcon = this.getEmptyIcon({ isEmptyMessageBySearch, colorMode });

        const styles = style(colorMode);

        return (
            <Pressable
                style   = {[
                    styles.emptyContainer,
                    { paddingBottom: keyboardHeight ? keyboardHeight - 20 : 0 }
                ]}
                onPress = {this.handleClickOutsideSearch}
            >
                <Image
                    style  = {[
                        styles.emptyIcon,
                        { marginBottom: isEmptyMessageBySearch ? 0 : 10 }
                    ]}
                    source = {EmptyIcon}
                    height = {isEmptyMessageBySearch ? 180 : 250}
                    width  = {isEmptyMessageBySearch ? 180 : 250}
                />
                <View style = {styles.emptyTextContainer}>
                    <Text style = {styles.emptyTitle}>
                        { isEmptyMessageBySearch
                            ? t('Nothing found')
                            : t('You have no attached tags yet')
                        }
                    </Text>

                    <Text style = {styles.emptySubtitle}>
                        { isEmptyMessageBySearch
                            ? t('We couldn\'t find any results for your search TAGS')
                            : t('Attach a tag to your account')
                        }
                    </Text>

                    { canAttachTokens && !searchQuery
                        ? (
                            <View style={styles.addTagControlWrapper}>
                                <Button
                                    title       = {t('Add new tag')}
                                    onPress     = {this.handleOpenCreateModal}
                                    type        = 'secondary'
                                />
                            </View>
                        ) : null
                    }
                </View>
            </Pressable>
        );
    }

    renderSubjectToken = ({ item }) => {
        const { colorMode } = this.props;
        const { name, code, isLoading, enabled, id } = item;

        const pointStateColor = enabled
            ? colors[colorMode].ENABLED_SUBJECT_TOKEN
            : colors[colorMode].DISABLED_SUBJECT_TOKEN;
        const iconColor = enabled
            ? colors[colorMode].ENABLED_SUBJECT_ICON
            : colors[colorMode].DISABLED_SUBJECT_ICON;

        const styles = style(colorMode);

        return (
            <BorderedBlock
                key            = {id}
                containerStyle = {{
                    ...styles.tokenBlock,
                    ...styles.entityRightPadding,
                    backgroundColor : pointStateColor
                }}
            >
                <Pressable onLongPress={this.handleTagLongPress(name)} style={styles.customBlock}>
                    <View style={styles.leftPart}>
                        <View style={styles.leftPartIcon}>
                            { isLoading
                                ? <ActivityIndicator color={colors[colorMode].PRIMARY} />
                                : (
                                    <Icon
                                        style = {styles.tokenIcon}
                                        type  = {enabled ? 'successCircle' : 'waitingCircle'}
                                        color = {iconColor}
                                        size  = {20}
                                    />
                                )
                            }
                        </View>
                        <View style={styles.leftPartContent}>
                            <Text style={[ styles.tokenName ]} numberOfLines={1}>
                                {name}
                            </Text>
                            <View style={styles.tokenCode}>
                                <Text style={[ styles.name, { marginRight: 3, fontSize: 12 } ]} variant='caption1' numberOfLines={1}>
                                    {code}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.rightPart} onPress={this.handleOpenActionsModal(item)}>
                        <Icon style={styles.actionsIcon} type='dots' size={18} />
                    </TouchableOpacity>
                </Pressable>
            </BorderedBlock>
        );
    }

    getKeyExtractor = item => `${item?.id}`;

    renderSubjectTokensScreen(filteredAccesses) {
        const { colorMode } = this.props;
        const { isRefreshing } = this.state;
        const styles = style(colorMode);

        return (
            <KeyboardAwareFlatList
                data              = {filteredAccesses}
                renderItem        = {this.renderSubjectToken}
                style             = {[ styles.contentContainer, styles.listWithoutRightPadding ]}
                refreshControl    = {
                    <RefreshControl
                        refreshing = {isRefreshing}
                        onRefresh  = {this.handleRefresh}
                        colors     = {[ colors[colorMode].PRIMARY ]}
                        tintColor  = {colors[colorMode].PRIMARY}
                    />
                }
            />
        );
    }

    render() {
        const { searchQuery, showCreateModal } = this.state;
        const { colorMode, list, t, isProcessing } = this.props;
        const filteredSubjectTokens = searchQuery ? filterByName(list, searchQuery) : list;
        const isNoTokens = !filteredSubjectTokens.length;
        const isEmptyMessageBySearch =  !!searchQuery;
        const isShowProcessing = !list.length && isProcessing;

        const styles = style(colorMode);

        return (
            <View style={styles.container}>
                { isShowProcessing
                    ? (
                        <View style={styles.loaderWrapper}>
                            <ActivityIndicator color={colors[colorMode].PRIMARY} size='large' />
                        </View>
                    ) : (
                        <>
                            <View style={styles.searchWrapper}>
                                { !!list.length
                                    ? (
                                        <SearchBar
                                            platform       = {Platform.OS}
                                            onChangeText   = {this.handleSearchChange}
                                            value          = {searchQuery}
                                            placeholder    = {t('Search')}
                                            colorMode      = {colorMode}
                                            containerStyle = {styles.search}
                                        />
                                    ) : null
                                }
                            </View>
                            { isNoTokens
                                ? this.renderEmptyDescription(isEmptyMessageBySearch)
                                : this.renderSubjectTokensScreen(filteredSubjectTokens)
                            }
                        </>
                    )
                }
                <ActionsModal
                    modalRef       = {this.modalRef}
                    onDeleteEntity = {this.handleDetachToken}
                    onChangeState  = {this.handleChangeTokenState}
                />
                <EditInputModal
                    colorMode    = {colorMode}
                    visible      = {showCreateModal}
                    value        = {''}
                    onSave       = {this.handleCreateToken}
                    onDismiss    = {this.handleCloseCreateModal}
                    label        = {t('Tag ID')}
                    maxLength    = {16}
                    keyboardType = {isIOS ? 'ascii-capable-number-pad' : 'numeric'}
                />
            </View>
        );
    }
}

export default withKeyboardEvents(connect(
    state => ({
        list            : state.subjectTokens.list,
        canAttachTokens : state.subjectTokens.canAttachTokens,
        isProcessing    : state.subjectTokens.isProcessing,
        colorMode       : state.theme.mode
    }),
    { ...subjectTokenActions }
)(withTranslation()(SubjectTokensScreen)));
