import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { KeyboardAvoidingView,
    View,
    Pressable,
    Keyboard,
    FlatList
    // RefreshControl,
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';

import AccessPointBtn               from '../../ui-kit/AccessPointBtn';
import LoadingBlock                 from '../../ui-kit/LoadingBlock';
import EmptyBlock                   from '../../ui-kit/EmptyBlock';

import * as accessPointsActions     from '../../../actions/accessPoints';
import * as readerGroupsActions     from '../../../actions/readerGroups';
// import screens                      from '../../../new-assets/constants/screens';
import { isIOS }                    from '../../../utils/platform';
import { mapAccessPoint }           from '../../../utils/mapper/mapAccessPoints';
import { getFulfilledAccessPoints } from '../../../selectors/homie';

import style                        from './GroupViewStyles';


class GroupView extends PureComponent {
    static propTypes = {
        // navigation : PropTypes.object.isRequired,
        t         : PropTypes.func.isRequired,
        colorMode : PropTypes.string.isRequired,
        // isAccessPointsFetching : PropTypes.bool.isRequired,
        route     : PropTypes.shape({
            params : PropTypes.shape({
                id : PropTypes.string
            }).isRequired
        }).isRequired,
        navigation           : PropTypes.object.isRequired,
        getReaderGroupsLogos : PropTypes.func.isRequired,
        fetchReaderGroupInfo : PropTypes.func.isRequired,
        devices              : PropTypes.object.isRequired,
        isDeleting           : PropTypes.bool.isRequired
    }

    // static defaultProps = {
    // }

    state = {
        entityData    : void 0,
        isLoadingInfo : true
        // isAccessPointsRefreshing : false
    };

    componentDidMount() {
        const { getReaderGroupsLogos, navigation } = this.props;

        getReaderGroupsLogos();

        navigation.addListener('focus', this.fetchReaderGroupInfo);
    }

    componentWillUnmount() {
        const { navigation } = this.props;

        navigation.removeListener('focus', this.fetchReaderGroupInfo);
    }

    fetchReaderGroupInfo = () => {
        const { route, navigation } = this.props;
        const { id } = route?.params;
        const { fetchReaderGroupInfo } = this.props;

        this.setState({
            isLoadingInfo : true
        });

        fetchReaderGroupInfo({
            id,
            onSuccess : (entityData) => {
                this.setState({
                    entityData,
                    isLoadingInfo : false
                });

                navigation.setOptions({ title: entityData?.name });
                navigation.setParams({ itemData: entityData });
            },
            onError : () => {
                this.setState({
                    isLoadingInfo : false
                });
            }
        });
    }

    getFulfilledList = (list) => {
        const { devices } = this.props;
        const processList = list?.map(mapAccessPoint);

        return getFulfilledAccessPoints(processList, devices);
    }

    handleOutsidePress = () => Keyboard.dismiss();

    // handleRefreshAccessPoints = async () => {
    //     this.setState({
    //         isAccessPointsRefreshing : true
    //     });

    //     try {
    //         await this.props.getAccessPoints();
    //     } finally {
    //         this.setState({
    //             isAccessPointsRefreshing : false
    //         });
    //     }
    // }


    renderAccessPoint = ({ item, drag = undefined, index }) => {
        const { isUpdating = false } = this.state;
        const { colorMode, isDeleting } = this.props;
        const {
            name,
            topic,
            statusColor,
            value,
            isValueProcessing,
            isEditable,
            accessCamera,
            id
        } = item;

        return (
            <AccessPointBtn
                key                 = {`${topic}${value}${index}`}
                value               = {value}
                name                = {name}
                status              = {statusColor}
                topic               = {topic}
                isExistInHomie      = {!!topic}
                id                  = {id}
                isProcessing        = {isValueProcessing}
                isEditable          = {!isDeleting && !isUpdating && isEditable}
                onDrag              = {drag}
                colorMode           = {colorMode}
                accessCamera        = {accessCamera}
            />
        );
    }

    renderAccessPoints = () => {
        const {
            colorMode, t
        } = this.props;
        const { isLoadingInfo, entityData } = this.state;
        const styles = style(colorMode);

        // const CUSTOM_REFRESH_CONTROL = (
        //     <RefreshControl
        //         refreshing = {isAccessPointsRefreshing}
        //         onRefresh  = {this.handleRefreshAccessPoints}
        //         colors     = {[ colors[colorMode].PRIMARY ]}
        //         tintColor  = {colors[colorMode].PRIMARY}
        //     />
        // );

        if (isLoadingInfo) return <LoadingBlock />;

        const list = this.getFulfilledList(entityData?.accessTokenReaders);

        if (!list?.length && !isLoadingInfo) {
            return (
                <EmptyBlock
                    title          = {t('You have no available access points yet')}
                    subtitle       = {t('Contact your administrator to get your first access point')}
                    // refreshControl = {CUSTOM_REFRESH_CONTROL}
                />
            );
        }

        return (
            <FlatList
                data                  = {list}
                renderItem            = {this.renderAccessPoint}
                style                 = {styles.scroll}
                contentContainerStyle = {styles.listContainer}
                // refreshControl        = {CUSTOM_REFRESH_CONTROL}
            />
        );
    }

    render() {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return (
            <Pressable onPress={this.handleOutsidePress} style={styles.pressableWrapper}>
                <KeyboardAvoidingView
                    style    = {styles.container}
                    behavior = {isIOS ? 'padding' : 'height'}
                >
                    <View  style = {styles.wrapper}>
                        { this.renderAccessPoints() }
                    </View>
                </KeyboardAvoidingView>
            </Pressable>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const { id } = ownProps?.route?.params;
        const isDeleting = state.readerGroups.deletingGroups?.includes(id);

        return {
            colorMode : state.theme.mode,
            devices   : state.homie.devices,
            isDeleting
        };
    },
    {
        ...accessPointsActions,
        ...readerGroupsActions
    }
)(withTranslation()(GroupView));
