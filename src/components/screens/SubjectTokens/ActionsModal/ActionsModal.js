/* eslint-disable react/no-multi-comp */
import React, {
    useImperativeHandle,
    useState
}                                        from 'react';
import PropTypes                         from 'prop-types';
import { connect }                       from 'react-redux';


import { View, TouchableOpacity }        from 'react-native';
import { withTranslation }               from 'react-i18next';

import * as readerGroupsActions          from '../../../../actions/readerGroups';
import { accessPointsSelector }          from '../../../../selectors/homie';
import colors                            from '../../../../new-assets/constants/colors';

import Modal                             from '../../../new-ui-kit/Modal';
import Icon                              from '../../../new-ui-kit/Icon';
import Text                              from '../../../new-ui-kit/Text';

import style                             from './ActionsModalStyles';


function ActionsModal(props) {
    const { onDeleteEntity, onChangeState, modalRef, colorMode, t } = props;

    const [ entityData, setEntityData ] = useState(null);
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    useImperativeHandle(modalRef, () => ({
        openModal : data => {
            setEntityData(data);
            setIsModalVisible(true);
        }
    }));

    function handleDismiss() {
        setIsModalVisible(false);
        setEntityData(null);
    }

    function handleAction(action) {
        return () => {
            if (action === 'remove') {
                handleDismiss();
                setTimeout(() => onDeleteEntity(entityData), 100);
            } else {
                onChangeState(entityData);
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
    const iconColor = colors[colorMode].TEXT_PRIMARY;

    return (
        <Modal
            visible          = {isModalVisible}
            colorMode        = {colorMode}
            onDismiss        = {handleDismiss}
            animationType    = 'slide'
            height           = 'auto'
            header           = {entityData?.name}
            withCloseIcon
        >
            <View style={styles.container}>

                { entityData?.enabled
                    ? renderAction({ action: 'edit', iconColor, iconType: 'waitingCircle', text: t('Turn off the tag') })
                    : renderAction({ action: 'edit', iconColor, iconType: 'successCircle', text: t('Turn on the tag') })
                }

                { renderAction({
                    action    : 'remove',
                    iconType  : 'trash',
                    text      : t('Delete tag.'),
                    color     : 'red',
                    iconColor : colors[colorMode].ERROR
                }) }
            </View>
        </Modal>
    );
}

ActionsModal.propTypes = {
    onDeleteEntity : PropTypes.func.isRequired,
    onChangeState  : PropTypes.func.isRequired,
    modalRef       : PropTypes.object.isRequired,
    colorMode      : PropTypes.string.isRequired,
    t              : PropTypes.func.isRequired
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
