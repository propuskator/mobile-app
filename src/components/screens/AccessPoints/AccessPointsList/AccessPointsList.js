import React, { PureComponent }             from 'react';
// import { connect }                          from 'react-redux';
import PropTypes                            from 'prop-types';
import {
    View,
    RefreshControl,
    Image
}                                           from 'react-native';
import { ScrollView }                       from 'react-native-gesture-handler';
import DraggableFlatList                    from 'react-native-draggable-flatlist';
import { KeyboardAwareFlatList }            from 'react-native-keyboard-aware-scroll-view';

import colors                               from '../../../../assets/constants/colors';

import { constructAccessPointData }         from '../../../../selectors/homie';
import EditInputModal                       from '../../../modals/InputModal';

import { mapAccessPoint }                   from '../../../../utils/mapper/mapAccessPoints';
import { smallHeight, mediumHeight }        from '../../../../utils/platform';
import { validatePointNameValue }           from '../../../../utils/validation';

import PicEmptyDeviceLight                  from '../../../../new-assets/images-png/PicNoDevices.png';
import PicEmptyDeviceDark                   from '../../../../new-assets/images-png/PicNoDevicesDark.png';
import PicEmptySearchLight                  from '../../../../new-assets/images-png/PicEmptySearch.png';
import PicEmptySearchDark                   from '../../../../new-assets/images-png/PicEmptySearchDark.png';
import { withKeyboardEvents }               from '../../../hoc/withKeyboardEvents';
import AccessPointBtn                       from '../../../new-ui-kit/AccessPointBtn';
import Text                                 from '../../../new-ui-kit/Text';
import KeyboardAwareScroll                  from '../../../new-ui-kit/KeyboardAwareScroll';

import { filterByName }                     from '../utils';
import style                                from './AccessPointsListStyles';


const DEFAULT_INPUT_MODAL_STATE = {
    isVisible : false,
    value     : '',
    maxLength : void 0
};

class AccessPointsList extends PureComponent {
    static propTypes = {
        list                    : PropTypes.array.isRequired,
        isFetching              : PropTypes.bool.isRequired,
        isUpdating              : PropTypes.bool.isRequired,
        renameAccessPoint       : PropTypes.func.isRequired,
        updateLocalAccessPoints : PropTypes.func.isRequired,
        t                       : PropTypes.func.isRequired,
        colorMode               : PropTypes.string.isRequired,
        isRefreshing            : PropTypes.bool.isRequired,
        isEditMode              : PropTypes.bool.isRequired,
        onRefresh               : PropTypes.func.isRequired,
        renderRefreshControl    : PropTypes.func.isRequired,
        updateGroupData         : PropTypes.func.isRequired,
        devices                 : PropTypes.object.isRequired,
        searchQuery             : PropTypes.string,
        selectedGroup           : PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]),
        groupData : PropTypes.shape({
            id                 : PropTypes.any,
            accessTokenReaders : PropTypes.array
        }),
        onPressAccessPoint : PropTypes.func,
        keyboardHeight     : PropTypes.number.isRequired
    }

    static defaultProps = {
        groupData          : void 0,
        searchQuery        : '',
        selectedGroup      : void 0,
        onPressAccessPoint : void 0
    }

    state = {
        inputModalState : DEFAULT_INPUT_MODAL_STATE
    }

    handleChangeName = ({ id, value, onSuccess, onError, onFinally } = {}) => {
        validatePointNameValue({
            data      : { name: value },
            onSuccess : () => {
                this.changeAccessPointName({
                    id,
                    value,
                    onSuccess,
                    onError,
                    onFinally
                });
            },
            onError : error => {
                onError({ error, target: 'state' });
                if (onFinally) onFinally();
            }
        });
    }

    handleChangeModalState = (inputModalState) => {
        this.setState({ inputModalState });
    }

    changeAccessPointName = async ({ id, value, onSuccess, onError, onFinally }) => {
        try {
            const { renameAccessPoint } = this.props;

            renameAccessPoint({
                accessTokenReaderId : id,
                customName          : value,
                onSuccess           : () => {
                    if (onSuccess) onSuccess();
                    const accessPoints = this.getAccessPointsList();
                    const newList = accessPoints?.map(item => {
                        return item?.id === id ? { ...item, name: value } : item;
                    });

                    this.handleUpdateList(newList);
                },
                onError,
                onFinally
            });
        } catch (error) {
            console.log('Rename point error', error);
            if (onFinally) onFinally();
        }
    }

    getEmptyIcon = ({ isEmptyMessageBySearch, colorMode } = {}) => {
        if (isEmptyMessageBySearch) {
            return colorMode === 'light' ? PicEmptySearchLight : PicEmptySearchDark;
        }

        return colorMode === 'light' ? PicEmptyDeviceLight : PicEmptyDeviceDark;
    }

    renderEmptyDescription(isEmptyMessageBySearch) {
        const { colorMode, t, isRefreshing, onRefresh } = this.props;
        const EmptyIcon = this.getEmptyIcon({ isEmptyMessageBySearch, colorMode });

        const styles = style(colorMode);
        const isSmallScreens = (smallHeight || mediumHeight);

        return (
            <ScrollView
                style                 = {{ minHeight: !isSmallScreens ? 280 : 230, height: '100%', flex: 1 }}
                contentContainerStyle = {styles.emptyContainer}
                refreshControl        = {
                    <RefreshControl
                        refreshing = {isRefreshing}
                        onRefresh  = {onRefresh}
                        colors     = {[ colors[colorMode].PRIMARY ]}
                        tintColor  = {colors[colorMode].PRIMARY}
                    />
                }
            >
                <Image
                    style  = {[
                        styles.emptyIcon,
                        { marginBottom: isEmptyMessageBySearch ? 0 : 35 }
                    ]}
                    source = {EmptyIcon}
                    height = {isEmptyMessageBySearch ? 180 : 200}
                    width  = {isEmptyMessageBySearch ? 180 : 200}
                />

                <View style = {styles.emptyTextContainer}>
                    <Text style = {[ styles.emptyTitle ]}>
                        { isEmptyMessageBySearch ? t('Nothing found') : t('You have no available access points yet') }
                    </Text>
                    <Text style = {styles.emptySubtitle}>
                        { isEmptyMessageBySearch
                            ? t('We couldn\'t find any results for your search')
                            : t('Contact your administrator to get your first access point')
                        }
                    </Text>
                </View>
            </ScrollView>
        );
    }

    renderAccessPoint = ({ item, drag = undefined }) => {
        const {
            isEditMode, isUpdating, selectedGroup,
            devices, colorMode, onPressAccessPoint
        } = this.props;
        const accessPoint = selectedGroup !== 'all'
            ? constructAccessPointData({ devices, restAccessPointData: mapAccessPoint(item) })
            : item;

        const {
            name,
            topic,
            statusColor,
            value,
            isValueProcessing,
            isEditable,
            accessCamera,
            id,
            phone,
            displayedTopics
        } = accessPoint;

        const styles = style(colorMode);

        return (
            <AccessPointBtn
                key                 = {id}
                containerStyle      = {styles.entityRightPadding}
                value               = {value}
                name                = {name}
                status              = {statusColor}
                topic               = {topic}
                isExistInHomie      = {!!topic}
                id                  = {id}
                isProcessing        = {isValueProcessing}
                onChangeName        = {this.handleChangeName}
                isEditable          = {!isUpdating && isEditable}
                isEditMode          = {isEditMode}
                onDrag              = {drag}
                colorMode           = {colorMode}
                accessCamera        = {accessCamera}
                displayedTopics     = {displayedTopics}
                onSetModalState     = {this.handleChangeModalState}
                phone               = {phone}
                onPress             = {onPressAccessPoint}
            />
        );
    }

    draggableKeyExactor = (item) => `${item?.id}`

    handleDragEnd = ({ data }) => {
        this.handleUpdateList(data);
    };

    handleUpdateList = (newList) => {
        const {
            selectedGroup, updateLocalAccessPoints, updateGroupData
        } = this.props;

        if (selectedGroup === 'all') {
            updateLocalAccessPoints(newList);
        } else {
            updateGroupData({ accessTokenReaders: newList });
        }
    }

    getAccessPointsList = () => {
        const { list, selectedGroup, groupData } = this.props;

        if (selectedGroup === 'all') return list;
        if (groupData?.id !== selectedGroup) return [];

        return groupData?.accessTokenReaders;
    }

    renderAccessPoints(filteredList) {
        const { colorMode, isRefreshing, isEditMode } = this.props;
        const styles = style(colorMode);

        if (isEditMode) {
            return (
                <View style={styles.listWithoutRightPadding}>
                    <KeyboardAwareScroll
                        contentContainerStyle = {styles.contentContainer}
                        style                 = {styles.container}
                        extraScrollHeight     = {0}
                        enableOnAndroid
                    >
                        <View style={{ ...styles.draggableWrapper }}>
                            <DraggableFlatList
                                data         = {filteredList}
                                // eslint-disable-next-line react/jsx-no-bind
                                renderItem   = {this.renderAccessPoint}
                                keyExtractor = {this.draggableKeyExactor}
                                onDragEnd    = {this.handleDragEnd}
                            />
                        </View>
                    </KeyboardAwareScroll>
                </View>
            );
        }

        return (
            <KeyboardAwareFlatList
                data              = {filteredList}
                renderItem        = {this.renderAccessPoint}
                style             = {[ styles.listWithoutRightPadding ]}
                refreshControl    = {this.props.renderRefreshControl({
                    isRefreshing
                })}
            />
        );
    }

    render() {
        const { isFetching, searchQuery, selectedGroup, colorMode, keyboardHeight } = this.props;
        const { inputModalState } = this.state;
        const accessPoints = this.getAccessPointsList();
        const filteredList = searchQuery && selectedGroup === 'all'
            ? filterByName(accessPoints, searchQuery)
            : accessPoints;
        const isEmpty = !filteredList.length;
        const isEmptyBySearch =  !!searchQuery;
        const styles = style(colorMode);

        if (isEmpty && !isFetching) {
            return (
                <View style = {[ styles.container, { paddingBottom: keyboardHeight ? keyboardHeight - 20 : 0 } ]}>
                    { this.renderEmptyDescription(isEmptyBySearch) }
                </View>
            );
        }

        return (
            <>
                {this.renderAccessPoints(filteredList)}
                {/*
                    initially the modal window was rendered in an AccessPointButton
                    but because of parents scroll view, there was a bug associated with closing the modal window
                    therefore its here
                */}
                <EditInputModal
                    colorMode = {colorMode}
                    visible   = {!!inputModalState?.isVisible}
                    value     = {inputModalState?.value}
                    onSave    = {inputModalState.onSave}    // eslint-disable-line
                    onDismiss = {inputModalState.onDismiss} // eslint-disable-line
                    {...(inputModalState?.props || {})}
                />
            </>
        );
    }
}

export default withKeyboardEvents(AccessPointsList);
