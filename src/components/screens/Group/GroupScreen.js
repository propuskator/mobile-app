import React, { PureComponent, createRef }                    from 'react';
import PropTypes                                              from 'prop-types';
import { withTranslation }                                    from 'react-i18next';
import {
    View,
    RefreshControl,
    Alert,
    Pressable,
    Keyboard
}                                                             from 'react-native';
import { connect }                                            from 'react-redux';

import { KeyboardAwareFlatList }                              from 'react-native-keyboard-aware-scroll-view';

import * as accessPointsActions                               from '../../../actions/accessPoints';
import * as readerGroupsActions                               from '../../../actions/readerGroups';

import { accessPointsSelector }                               from '../../../selectors/homie';

import Text                                                   from '../../new-ui-kit/Text';
import BorderedBlock                                          from '../../new-ui-kit/BorderedBlock';
import Button                                                 from '../../new-ui-kit/Button';
import Input                                                  from '../../new-ui-kit/Input';
import Checkbox                                               from '../../new-ui-kit/Checkbox';
import GroupTag                                               from '../../new-ui-kit/GroupTag';
import LoadingBlock                                           from '../../new-ui-kit/LoadingBlock';

import COLORS                                                 from '../../../new-assets/constants/colors';

import {
    validateReaderGroup,
    mapErrors
}                                                             from '../../../utils/validation';
import { dumpGroup }                                          from '../../../utils/dumps/group';
import { getLogoTypeByPath }                                  from '../../../utils/readerGroups';

import GroupTagModal                                          from './GroupTagModal';

import style                                                  from './GroupScreenStyles';


class GroupScreen extends PureComponent {
    static propTypes = {
        accessPoints           : PropTypes.array,
        logosById              : PropTypes.object,
        isAccessPointsFetching : PropTypes.bool.isRequired,
        getReaderGroupsLogos   : PropTypes.func.isRequired,
        fetchReaderGroupInfo   : PropTypes.func.isRequired,
        getAccessPoints        : PropTypes.func.isRequired,
        getReaderGroups        : PropTypes.func.isRequired,
        createReaderGroup      : PropTypes.func.isRequired,
        updateReaderGroup      : PropTypes.func.isRequired,
        navigation             : PropTypes.object.isRequired,
        route                  : PropTypes.object.isRequired,
        colorMode              : PropTypes.string.isRequired,
        t                      : PropTypes.func.isRequired
    }

    static defaultProps = {
        accessPoints : [],
        logosById    : {}
    }

    constructor(props) {
        super(props);

        const { itemData = {}, id } = props.route.params || {};
        const { name, logoPath, logoColor, accessTokenReaders } = itemData;

        this.state = {
            formData : {
                logoColor,
                name         : name || '',
                logo         : getLogoTypeByPath(logoPath) || '',
                accessPoints : (accessTokenReaders || []).map(reader => reader.id)
            },
            errors           : {},
            isLoading        : false,
            isLoadingInfo    : !!id,
            isRefreshing     : false,
            isConfirmOnClose : false,
            isCreateGroup    : !id
        };

        this.modalRef = createRef();
    }

    componentDidMount() {
        const { getReaderGroupsLogos, route, navigation, getAccessPoints } = this.props;
        const { id } = route?.params || {};

        navigation.addListener('beforeRemove', this.handleClosePage);

        getAccessPoints();
        getReaderGroupsLogos();

        if (id) this.fetchReaderGroupInfo(id);
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('beforeRemove', this.handleClosePage);
    }

    handleClosePage = e => {
        const { navigation, t } = this.props;
        const { isConfirmOnClose } = this.state;

        if (![ 'POP', 'GO_BACK' ].includes(e.data?.action?.type) || !isConfirmOnClose) return;

        e.preventDefault();

        Alert.alert(
            t('Discard changes?'),
            t('All your current changes will be discarded without saving.'),
            [
                {
                    text    : t('Discard'),
                    style   : 'destructive',
                    onPress : () => navigation.dispatch(e.data.action)
                },
                { text: t('Don\'t leave'), onPress: () => {} }
            ]
        );
    }

    fetchReaderGroupInfo = id => {
        const { fetchReaderGroupInfo } = this.props;

        fetchReaderGroupInfo({
            id,
            onSuccess : (entityData) => {
                const accessTokenReaderIds = entityData?.accessTokenReaders?.map(item => item?.id);

                this.setState({
                    formData : {
                        ...this.state?.formData,
                        accessPoints : accessTokenReaderIds
                    },
                    isLoadingInfo : false
                });
            },
            onError : () => {
                this.setState({
                    isLoadingInfo : false
                });
            }
        });
    }

    handleOpenModal = () => {
        this.modalRef.current?.openModal(this.state.formData);
    }

    handleModalSubmit = ({ logo, logoColor }) => {
        this.handleChangeFields({ logo, logoColor });
    };

    handleChangeField = (key, value) => {
        this.handleChangeFields({
            [key] : value
        });
    }

    handleChangeFields = (fields = {}) => {
        this.setState({
            formData : {
                ...this.state.formData,
                ...fields
            },
            errors           : {},
            isConfirmOnClose : true
        });
    }

    handleSelectItem = accessPointId => () => {
        const { accessPoints } = this.state?.formData;

        setTimeout(() => {
            if (accessPoints?.includes(accessPointId)) {
                this.handleChangeFields({
                    accessPoints : accessPoints?.filter(id => id !== accessPointId)
                });
            } else {
                this.handleChangeFields({
                    accessPoints : [ ...accessPoints, accessPointId ]
                });
            }
        }, 0);
    }

    handleRefresh = async () => {
        this.setState({ isRefreshing: true });

        try {
            await this.props.getAccessPoints();
        } finally {
            this.setState({ isRefreshing: false });
        }
    }

    handleCloseKeyboard = () => {
        Keyboard.dismiss();
    }

    getProcessErrors = error => ({
        name         : error?.name,
        accessPoints : error?.accessTokenReaderIds,
        logo         : error?.logoType
    })

    handleGroupError = error => {
        const errors = error?.errors && mapErrors(error?.errors);

        this.setState({
            isLoading : false,
            errors    : this.getProcessErrors(errors)
        });
    }

    handleError = error => {
        this.setState({
            isLoading : false,
            errors    : this.getProcessErrors(error)
        });
    }

    handleSave = async () => {
        const {
            createReaderGroup, updateReaderGroup,
            getReaderGroups, route, navigation
        } = this.props;

        const { formData, isLoading } = this.state;

        if (isLoading) return;

        const { id } = route?.params || {};
        const isCreateGroup = !id;

        const processData = dumpGroup(formData);

        validateReaderGroup({
            data      : processData,
            onSuccess : async validData => {
                const handler = isCreateGroup ? createReaderGroup : updateReaderGroup;

                this.setState({ isLoading: true });

                handler({
                    data      : validData,
                    id,
                    onSuccess : () => {
                        this.setState({ isLoading: false }, async () => {
                            await getReaderGroups();
                            this.setState({ isConfirmOnClose: false });
                            navigation.goBack();
                        });
                    },
                    onError : (errors) => {
                        this.handleGroupError(errors);
                    }
                });
            },
            onError : errors => {
                this.handleError(errors);
            }
        });
    }

    renderListItem = ({ item = {} }) => {
        const { colorMode } = this.props;
        const { accessPoints } = this.state?.formData;

        const { id, name } = item;

        const isSelected = accessPoints?.includes(id);

        const styles = style(colorMode);

        return (
            <Pressable
                onPress = {this.handleSelectItem(id)}
                style   = {styles.accessPointContainer}
            >
                <Text
                    style         = {styles.accessPointName}
                    numberOfLines = {1}
                >
                    {name}
                </Text>

                <Checkbox
                    value         = {isSelected}
                    colorMode     = {colorMode}
                    disabled
                />
            </Pressable>
        );
    }

    renderList = () => {
        const { accessPoints, isAccessPointsFetching, colorMode, t } = this.props;
        const { isRefreshing, isLoadingInfo } = this.state;

        const styles = style(colorMode);

        if ((isAccessPointsFetching && !isRefreshing) || isLoadingInfo) {
            return <LoadingBlock />;
        }

        return (
            <View style={styles.listWrapper} >
                <Text style={styles.listTitle} variant='caption1'>
                    {t('Access points')}
                </Text>

                <KeyboardAwareFlatList
                    data                  = {accessPoints}
                    renderItem            = {this.renderListItem}
                    style                 = {styles.scroll}
                    contentContainerStyle = {styles.listContainer}
                    refreshControl        = {
                        <RefreshControl
                            refreshing = {isRefreshing}
                            onRefresh  = {this.handleRefresh}
                            colors     = {[ COLORS[colorMode].PRIMARY ]}
                            tintColor  = {COLORS[colorMode].PRIMARY}
                        />
                    }
                />
            </View>
        );
    }

    render = () => {
        const { logosById, colorMode, t } = this.props;

        const { formData, isCreateGroup, isLoading } = this.state;
        const { name, logo, logoColor, accessPoints } = formData;

        const isSubmitDisabled = !name?.trim().length || !accessPoints.length;

        const styles = style(colorMode);

        return (
            <Pressable style={styles.container} onPress={this.handleCloseKeyboard}>
                <GroupTagModal onSuccessSubmit={this.handleModalSubmit} modalRef={this.modalRef} />

                <BorderedBlock
                    style   = {styles.groupBlock}
                    variant = 'secondary'
                >
                    { logo
                        ?  <GroupTag
                            variant    = 'filled'
                            logoPath   = {logo ? logosById[logo] : null}
                            color      = {logoColor}
                            onClick    = {this.handleOpenModal}
                            groupStyle = {styles.group}
                            colorMode  = {colorMode}
                            size       = 'M'
                            withEditIcon
                        />
                        : <GroupTag
                            variant    = 'dashed'
                            type       = 'add'
                            onClick    = {this.handleOpenModal}
                            groupStyle = {styles.group}
                            colorMode  = {colorMode}
                            size       = 'M'
                        />
                    }

                    <Text variant='caption1'>{t('Group icon')}</Text>

                    <Input
                        colorMode           = {colorMode}
                        name                = 'name'
                        placeholder         = {t('Enter group name')}
                        inputContainerStyle = {styles.groupInputContainer}
                        errorStyle          = {styles.inputError}
                        value               = {formData?.name}
                        onChange            = {this.handleChangeField}
                        // autoFocus
                    />
                </BorderedBlock>

                {this.renderList()}

                <Button
                    title          = {isCreateGroup ? t('Create group') : t('Save changes')}
                    containerStyle = {styles.submitButtonContainer}
                    isDisabled     = {isSubmitDisabled}
                    onPress        = {this.handleSave}
                    loading        = {isLoading}
                />
            </Pressable>
        );
    }
}

export default connect(
    state => {
        return {
            colorMode              : state.theme.mode,
            accessPoints           : accessPointsSelector(state),
            isAccessPointsFetching : state.accessPoints.isFetching,
            logosById              : state.readerGroups.logosById
        };
    }, {
        ...accessPointsActions,
        ...readerGroupsActions
    }
)(withTranslation()(GroupScreen));
