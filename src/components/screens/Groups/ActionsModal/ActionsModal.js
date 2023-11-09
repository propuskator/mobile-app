/* eslint-disable react/no-multi-comp */
import React, {
    useImperativeHandle,
    useState
}                                                            from 'react';
import PropTypes                                             from 'prop-types';
import { connect }                                           from 'react-redux';


import { View, TouchableOpacity, Alert }                     from 'react-native';
import { withTranslation }                                   from 'react-i18next';

import * as readerGroupsActions                              from '../../../../actions/readerGroups';
import { accessPointsSelector }                              from '../../../../selectors/homie';
import colors                                                from '../../../../new-assets/constants/colors';

import Modal                                                 from '../../../new-ui-kit/Modal';
import Icon                                                  from '../../../new-ui-kit/Icon';
import Text                                                  from '../../../new-ui-kit/Text';

import screens                                               from '../../../../new-assets/constants/screens';

import style                                                 from './ActionsModalStyles';


function ActionsModal(props) {
    const { isAccessPointsExist, deleteGroup, navigation, modalRef, colorMode, t } = props;

    const [ groupData, setGroupData ] = useState(null);
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    useImperativeHandle(modalRef, () => ({
        openModal : groupEntity => {
            setGroupData(groupEntity);
            setIsModalVisible(true);
        }
    }));

    function handleDismiss() {
        setIsModalVisible(false);
        setGroupData(null);
    }

    function handleAction(action) {
        return () => {
            if (action === 'remove') {
                Alert.alert(
                    t('Delete group'),
                    t('Are you sure you want to delete group?'),
                    [
                        {
                            text    : t('Yes, delete'),
                            onPress : async () => {
                                await deleteGroup({ id: groupData?.id });
                                handleDismiss();
                            },
                            style : 'destructive'
                        },
                        {
                            text : t('Cancel')
                        }
                    ],
                    { cancelable: true }
                );
            } else {
                navigation.navigate(screens.GROUP, {
                    id       : groupData?.id,
                    itemData : groupData
                });
                handleDismiss();
            }
        };
    }

    // eslint-disable-next-line react/prop-types
    function renderAction({ action, iconType, text, color, iconColor }) {
        return (
            <TouchableOpacity style={styles.actionContainer} onPress={handleAction(action)}>
                <Icon type={iconType} size={20} color={iconColor} />
                <Text style={styles.actionText} color={color}>{text}</Text>
            </TouchableOpacity>
        );
    }

    const styles = style(colorMode);

    return (
        <Modal
            visible          = {isModalVisible}
            colorMode        = {colorMode}
            onDismiss        = {handleDismiss}
            animationType    = 'slide'
            height           = 'auto'
            withCloseIcon
        >
            <View style={styles.container} >

                { isAccessPointsExist
                    ? renderAction({ action: 'edit', iconType: 'edit', text: t('Edit group') })
                    : <Text style={styles.warningText} variant='caption1'>
                        {t('All access points have been removed.')}
                    </Text>
                }

                { renderAction({
                    action    : 'remove',
                    iconType  : 'trash',
                    text      : t('Delete group'),
                    color     : 'red',
                    iconColor : colors[colorMode].ERROR
                }) }
            </View>
        </Modal>
    );
}

ActionsModal.propTypes = {
    isAccessPointsExist : PropTypes.bool.isRequired,
    deleteGroup         : PropTypes.func.isRequired,
    modalRef            : PropTypes.object.isRequired,
    navigation          : PropTypes.object.isRequired,
    colorMode           : PropTypes.string.isRequired,
    t                   : PropTypes.func.isRequired
};


export default connect(
    state => ({
        colorMode           : state.theme.mode,
        isAccessPointsExist : !!accessPointsSelector(state)?.length
    }),
    {
        ...readerGroupsActions
    }
)(withTranslation()(ActionsModal));
