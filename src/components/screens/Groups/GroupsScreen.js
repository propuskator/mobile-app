import React, { createRef, PureComponent }      from 'react';
import PropTypes                                from 'prop-types';

import { withTranslation }                      from 'react-i18next';
import {
    FlatList,
    View,
    TouchableOpacity
}                                               from 'react-native';
import { connect }                              from 'react-redux';

import { accessPointsSelector }                 from '../../../selectors/homie';

import * as readerGroupsActions                 from '../../../actions/readerGroups';
import * as accessPointsActions                 from '../../../actions/accessPoints';

import Text                                     from '../../new-ui-kit/Text';
import Icon                                     from '../../new-ui-kit/Icon';
import SvgUriIcon                               from '../../ui-kit/SvgUriIcon';
import ScreenStub                               from '../../new-ui-kit/ScreenStub';

import config                                   from '../../../config';

import screens                                  from '../../../new-assets/constants/screens';

import PicNoGroups                              from '../../../new-assets/images-png/PicNoGroups.png';
import PicNoGroupsDark                          from '../../../new-assets/images-png/PicNoGroupsDark.png';
import PicNoAccessPoints                        from '../../../new-assets/images-png/PicNoAccessPoints.png';
import PicNoAccessPointsDark                    from '../../../new-assets/images-png/PicNoAccessPointsDark.png';

import ActionsModal                             from './ActionsModal';

import style                                    from './GroupsScreenStyles';

const hitslop = { top: 5, bottom: 5, left: 5, right: 5 };

class GroupsScreen extends PureComponent {
    static propTypes = {
        groups              : PropTypes.array.isRequired,
        isGroupsFetching    : PropTypes.array.isRequired,
        getReaderGroups     : PropTypes.func.isRequired,
        getAccessPoints     : PropTypes.func.isRequired,
        isAccessPointsExist : PropTypes.bool.isRequired,
        navigation          : PropTypes.object.isRequired,
        colorMode           : PropTypes.string.isRequired,
        t                   : PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.modalRef = createRef();
    }

    componentDidMount() {
        const { navigation } = this.props;

        this.focusSubscribe = navigation.addListener('focus', this.handleScreenFocus);
    }

    componentDidUpdate(prevProps) {
        const { groups, isAccessPointsExist } = this.props;

        if (isAccessPointsExist !== prevProps.isAccessPointsExist
            || groups?.length !== prevProps?.groups?.length) {
            this.setHeaderOptions();
        }
    }

    componentWillUnmount() {
        this.focusSubscribe();
    }

    handleScreenFocus = () => {
        const { getReaderGroups, getAccessPoints } = this.props;

        getReaderGroups();
        getAccessPoints();
        this.setHeaderOptions();
    }

    setHeaderOptions = () => {
        const { isAccessPointsExist, navigation, colorMode, groups } = this.props;
        const styles = style(colorMode);

        navigation.setOptions({
            headerRight : () => (
                isAccessPointsExist && !!groups?.length
                    ? <TouchableOpacity
                        style   = {styles.headerOptionsIcon}
                        onPress = {this.handleCreateGroup}
                        hitSlop = {hitslop}
                    >
                        <Icon type='add' size={24} />
                    </TouchableOpacity>
                    : null
            )
        });
    }

    handleCreateGroup = () => {
        const { navigation } = this.props;

        navigation.navigate(screens.GROUP);
    }

    handleGoToAccessPoints = () => {
        const { navigation } = this.props;

        navigation.navigate(screens.ACCESS_POINTS);
    }

    renderFallback = name => {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <Text
                style         = {[ styles.logoLetter ]}
                numberOfLines = {1}
            >
                {name?.slice(0, 1)}
            </Text>
        );
    }

    handleOpenActionsModal = groupEntity => () => {
        this.modalRef.current?.openModal(groupEntity);
    }

    renderListItem = ({ item } = {}) => {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        const { name, logoPath, logoColor } = item || {};

        return (
            <TouchableOpacity
                onPress = {this.handleOpenActionsModal(item)}
                style   = {styles.groupItemContainer}
            >
                <View style={[ styles.groupItemCircle, { backgroundColor: logoColor } ]}>
                    <SvgUriIcon
                        iconStyle = {styles.groupItemIcon}
                        uri       = {logoPath ? `${config.API_URL}/${logoPath}` : null}
                        width     = {40}
                        height    = {40}
                        fallback  = {this.renderFallback(name)}
                    />
                </View>

                <Text style={styles.groupItemName} numberOfLines={1}>{name}</Text>

                <Icon style={styles.groupItemActions} type='dots' size={18} />
            </TouchableOpacity>
        );
    }

    renderList = list => {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <FlatList
                data                  = {list}
                renderItem            = {this.renderListItem}
                style                 = {styles.scroll}
                contentContainerStyle = {[
                    styles.listContainer
                ]}
            />
        );
    }

    renderEmpty = () => {
        const { isAccessPointsExist, colorMode, t } = this.props;

        return isAccessPointsExist
            ? <ScreenStub
                DefaultIcon   = {colorMode === 'light' ? PicNoGroups : PicNoGroupsDark}
                title         = {t('Groups have not been created yet')}
                subtitle      = {t('EmptyGroupsDescription')}
                buttonText    = {t('Create group')}
                onButtonPress = {this.handleCreateGroup}
                iconSize      = {200}
                iconStyle     = {{ marginBottom: 30 }}
            />
            : <ScreenStub
                DefaultIcon   = {colorMode === 'light' ? PicNoAccessPoints : PicNoAccessPointsDark}
                title         = {t('No added access points')}
                subtitle      = {t('Contact your administrator to get your first access point')}
                buttonText    = {t('Go to Access Points')}
                onButtonPress = {this.handleGoToAccessPoints}
                iconSize      = {200}
            />;
    }


    render() {
        const { groups, isGroupsFetching, colorMode, navigation } = this.props;
        const styles = style(colorMode);

        const isGroupsEmpty = !isGroupsFetching && !groups?.length;

        return (
            <View style={styles.container}>
                <ActionsModal navigation={navigation} modalRef={this.modalRef} />

                { isGroupsEmpty
                    ? this.renderEmpty()
                    : this.renderList(groups)
                }
            </View>
        );
    }
}


export default connect(
    state => ({
        groups              : state?.readerGroups?.list,
        isGroupsFetching    : state?.readerGroups?.isFetching,
        isAccessPointsExist : !!accessPointsSelector(state)?.length,
        colorMode           : state.theme.mode
    }),
    {
        ...readerGroupsActions,
        ...accessPointsActions
    }
)(withTranslation()(GroupsScreen));
