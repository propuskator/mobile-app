/* eslint-disable react/no-multi-comp */
import React, {
    useImperativeHandle,
    useState
}                                    from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator
}                                    from 'react-native';

import { connect }                   from 'react-redux';
import { withTranslation }           from 'react-i18next';
import PropTypes                     from 'prop-types';
import { ScrollView }                from 'react-native-gesture-handler';

import Text                          from '../../../new-ui-kit/Text';
import Modal                         from '../../../new-ui-kit/Modal';
import Button                        from '../../../new-ui-kit/Button';
import GroupTag                      from '../../../new-ui-kit/GroupTag';
import EmptyBlock                    from '../../../new-ui-kit/EmptyBlock';

import { getDefaultColor }           from '../../../screens/utils/groupLogo';

import COLORS                        from '../../../../new-assets/constants/colors';

import style                         from './GroupTagModalStyles';


const COLOR_OPTIONS = [
    '#56BDB1', '#56B0F0', '#BD6AB8', '#BDBD4D', '#BD6260',
    '#1C1D21', '#68CB74', '#8877DF', '#F19FC9', '#617396', '#D17973'
];
const DEFAULT_COLOR = getDefaultColor();


function GroupTagModal(props) {
    const { isLogosFetching, logosById, modalRef, onSuccessSubmit, colorMode, t } = props;

    const [ fields, setFields ] = useState({
        logo      : null,
        logoColor : DEFAULT_COLOR
    });

    const [ isModalVisible, setIsModalVisible ] = useState(false);

    useImperativeHandle(modalRef, () => ({
        openModal : ({ logo, logoColor } = {}) => {
            setFields({
                logo      : logo || null,
                logoColor : logoColor || DEFAULT_COLOR
            });
            setIsModalVisible(true);
        }
    }));

    function handleDismiss() {
        setIsModalVisible(false);
    }

    function handleChangeField({ name, value }) {
        return () => setFields(prev => ({
            ...prev,
            [name] : value
        }));
    }

    function handleSubmit() {
        if (onSuccessSubmit) onSuccessSubmit(fields);
        handleDismiss();
    }

    function renderLogos() {
        return (
            <View style={styles.groupsWrapper}>
                { logosKeys?.map(logoKey => (
                    <View style={styles.groupWrapper} key={logoKey}>
                        <GroupTag
                            colorMode  = {colorMode}
                            variant    = 'filled'
                            logoPath   = {logosById[logoKey]}
                            size       = {'M'}
                            onClick    = {handleChangeField({ name: 'logo', value: logoKey })}
                            isSelected = {fields?.logo === logoKey}
                            color      = {fields?.logoColor}
                        />
                    </View>
                )) }
            </View>
        );
    }

    function renderColors() {
        return (
            <View style={styles.colorOptions}>
                { [ DEFAULT_COLOR, ...COLOR_OPTIONS ]?.map(color => (
                    <TouchableOpacity
                        key     = {color}
                        style   = {styles.colorOptionWrapper}
                        onPress = {handleChangeField({ name: 'logoColor', value: color })}
                    >
                        <View
                            style = {[
                                styles.colorOption,
                                ...[ { backgroundColor: color } ]
                            ]}
                        />
                        { fields?.logoColor === color
                            ? <View
                                style={[
                                    styles.selectedOption,
                                    ...[ { borderColor: color } ]
                                ]}
                            />
                            : null
                        }
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    const styles = style(colorMode);

    const logosKeys = Object.keys(logosById);
    const isEmpty = !isLogosFetching && !logosKeys?.length;

    return (
        <Modal
            header           = {t('Group icon')}
            visible          = {isModalVisible}
            colorMode        = {colorMode}
            onDismiss        = {handleDismiss}
            headerTitleStyle = {styles.modalTitle}
            animationType    = 'slide'
            height           = {'90%'}
            withCloseIcon
        >
            <View style={styles.mainContainer}>
                <ScrollView
                    style                 = {styles.scroll}
                    contentContainerStyle = {styles.container}
                >
                    { isLogosFetching
                        ? <View style={styles.loaderWrapper}>
                            <ActivityIndicator size='large' color={COLORS[colorMode].PRIMARY} />
                        </View>
                        : null
                    }

                    { isEmpty
                        ? (
                            <EmptyBlock
                                title          = {t('You have no available logos yet')}
                                subtitle       = {t('Contact your administrator to get your logos')}
                            />
                        ) : null
                    }

                    { !isLogosFetching && logosKeys?.length
                        ? (
                            <>
                                {renderLogos()}

                                <Text variant='caption1' style={styles.sectionCaption}>
                                    {t('Background color')}
                                </Text>

                                {renderColors()}
                            </>
                        ) : null
                    }
                </ScrollView>


                <View style={styles.footer}>
                    <Button
                        title          = {t('Save')}
                        isDisabled     = {!(fields.logo || fields?.logoColor) || isEmpty}
                        onPress        = {handleSubmit}
                    />
                </View>
            </View>
        </Modal>
    );
}

GroupTagModal.propTypes = {
    isLogosFetching : PropTypes.bool.isRequired,
    logosById       : PropTypes.object.isRequired,
    modalRef        : PropTypes.object.isRequired,
    onSuccessSubmit : PropTypes.func.isRequired,
    colorMode       : PropTypes.string.isRequired,
    t               : PropTypes.func.isRequired
};


export default connect(
    state => ({
        isLogosFetching : state.readerGroups.isLogosFetching,
        logosById       : state.readerGroups.logosById,
        colorMode       : state.theme.mode
    })
)(withTranslation()(GroupTagModal));
