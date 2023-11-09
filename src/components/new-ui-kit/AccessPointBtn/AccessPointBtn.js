import React, {
    Component
}                                            from 'react';
import PropTypes                             from 'prop-types';
import {
    View,
    Pressable,
    TouchableOpacity,
    Linking,
    ActivityIndicator
}                                            from 'react-native';
import { withTranslation }                   from 'react-i18next';
import { connectActionSheet }                from '@expo/react-native-action-sheet';

import Text                                  from '../../new-ui-kit/Text';
import PushButton                            from '../../new-ui-kit/PushButton';
import AccessPointStatus                     from '../../new-ui-kit/AccessPointStatus';
import SvgIcon                               from '../../new-ui-kit/Icon';
import BorderedBlock                         from '../../new-ui-kit/BorderedBlock';
import Divider                               from '../../new-ui-kit/Divider';

import screens                               from '../../../new-assets/constants/screens';
import toast                                 from '../../../utils/Toast';
import * as NavigationHelper                 from '../../../utils/NavigationHelper';
import { getShortcuts }                      from '../../../utils/siri';
import { isIOS }                             from '../../../utils/platform';
import colors                                from '../../../new-assets/constants/colors';

import Relays                                from './Relays';
import Topics                                from './Topics';

import SettingsModal                         from './SettingsModal';
import style                                 from './AccessPointBtnStyles.js';

const BUTTON_PROPS = {
    titleProps : { allowFontScaling: false }
};
const EDIT_MODE_OPACITY = 0.5;

class AccessPointBtn extends Component {
    static propTypes = {
        value                      : PropTypes.bool,
        name                       : PropTypes.string.isRequired,
        status                     : PropTypes.string.isRequired,
        handleOpenAccess           : PropTypes.func.isRequired,
        topic                      : PropTypes.string.isRequired,
        onChangeName               : PropTypes.func,
        id                         : PropTypes.string.isRequired,
        isProcessing               : PropTypes.bool,
        isExist                    : PropTypes.bool,
        isEditable                 : PropTypes.bool,
        isEditMode                 : PropTypes.bool,
        isExistInHomie             : PropTypes.bool.isRequired,
        onDrag                     : PropTypes.func,
        t                          : PropTypes.func.isRequired,
        handleTriggerAccess        : PropTypes.func.isRequired,
        showActionSheetWithOptions : PropTypes.func.isRequired,
        colorMode                  : PropTypes.string.isRequired,
        accessCamera               : PropTypes.object.isRequired,
        containerStyle             : PropTypes.oneOfType([
            PropTypes.object, PropTypes.array, PropTypes.number
        ]),
        phone           : PropTypes.string,
        displayedTopics : PropTypes.array.isRequired,
        onSetModalState : PropTypes.func.isRequired,
        onPress         : PropTypes.func
    };

    static defaultProps = {
        isProcessing   : false,
        isEditable     : true,
        isEditMode     : false,
        isExist        : false,
        value          : false,
        phone          : '',
        onChangeName   : void 0,
        onDrag         : () => {},
        containerStyle : void 0,
        onPress        : void 0
    };

    constructor() {
        super();

        this.state = {
            showSettingsModal : false,
            localName         : ''
        };
    }

    componentWillUnmount() {
        if (this.fixModalOpenTimeout) clearTimeout(this.fixModalOpenTimeout);
    }

    handleOpenInstructionsScreen = ({ topic, name }) => () => {
        NavigationHelper.navigate(
            screens.INSTRUCTIONS,
            {
                shortcuts : getShortcuts({ topic, name })
            }
        );
    }

    handleOpenSettingsModal = () => {
        this.setState({ showSettingsModal: true });
    }

    handleCloseSettingsModal = () => {
        this.setState({ showSettingsModal: false });
    }

    handleOpenCameraStream = () => {
        const {
            topic,
            id,
            isProcessing,
            isEditable,
            name,
            accessCamera,
            t
        } = this.props;

        const { rtspUrl } = accessCamera;
        const pattern = /^(rtsp):\/\/[-._~:/&$@?=A-Za-z0-9]+$/;
        const isUrlValid = pattern.test(rtspUrl);

        try {
            if (isUrlValid) {
                NavigationHelper.navigate({
                    name   : screens.CAMERA_SCREEN,
                    key    : id,
                    params : {
                        accessPointTitle  : name,
                        accessCameraProps : accessCamera,
                        pushButtonProps   : {
                            topic,
                            id,
                            isProcessing,
                            isEditable
                        }
                    }
                });
            } else {
                toast.show(t('Camera URL is not valid'), 2);
            }
        } catch (error) {
            console.warn('Open camera error', error);

            toast.show(t('Camera URL is not valid'), 2);
        }
    }


    handleShowName = () => {
        const { name, isEditMode } = this.props;

        if (!isEditMode) toast.show(name, 2);
    }

    openCallMenu = () => {
        const { phone } = this.props;
        const phoneNumber = !isIOS
            ? `tel:${phone}`
            : `telprompt:${phone}`;

        Linking.openURL(phoneNumber);
        this.handleOpenSettingsModal();
    };

    handleFinishEditName = ({ value, onSuccess } = {}) => {
        const { onChangeName, id, name } = this.props;

        this.setState({ localValue: value });

        const trimmedValue = value?.trim() || '';
        const isUpdated = trimmedValue?.length && trimmedValue !== name;

        this.setState({ isProcessing: isUpdated, localName: trimmedValue });

        if (onChangeName && isUpdated) {
            onChangeName({
                id,
                value   : trimmedValue,
                onError : (errors) => {
                    console.error({ errors });
                },
                onSuccess,
                onFinally : () => {
                    this.setState({ isProcessing: false, localName: '' });

                    this.handleDismissNameModal();
                }
            });
        } else this.handleDismissNameModal();
    }

    handleOpenCallMenu = () => {
        const { showActionSheetWithOptions, t, phone } = this.props;

        if (!phone) return;
        if (isIOS) return this.openCallMenu();

        this.handleCloseSettingsModal();

        this.fixModalOpenTimeout = setTimeout(() => {
            const options = [
                t('Call phone', { phone }),
                t('Cancel')
            ];
            const CALL = 0;
            const CLOSE_MODAL_INDEX = 1;

            showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex : options.length - 1
                },
                index => {
                    switch (index) {
                        case CALL:
                            this.openCallMenu();
                            break;
                        case CLOSE_MODAL_INDEX:
                            this.handleOpenSettingsModal();
                            break;
                        default:
                            break;
                    }
                }
            );
        }, 0);
    }

    checkIsRelayTopic = (t) => !!t?.includes('/r/');

    renderAccessControl = () => {
        const {
            value,
            isProcessing,
            isEditable,
            colorMode,
            id,
            topic,
            isEditMode
        } = this.props;
        const styles = style(colorMode);

        return (
            <View
                style={[
                    styles.accessControlWrapper,
                    { opacity: isEditMode ? EDIT_MODE_OPACITY : 1 }
                ]}
            >
                <PushButton
                    {...BUTTON_PROPS}
                    id           = {id}
                    value        = {value}
                    topic        = {topic}
                    isProcessing = {isProcessing}
                    isEditable   = {isEditable}
                    isEditMode   = {isEditMode}
                />
            </View>
        );
    }

    renderRelays = () => {
        const { displayedTopics } = this.props;
        const relaysTopics = displayedTopics?.filter(this.checkIsRelayTopic);

        if (!relaysTopics?.length) return null;

        return (
            <Relays
                topics      = {relaysTopics}
                renderRelay = {this.renderRelayPoint}
            />
        );
    }

    renderRelayPoint = ({
        instance,
        topic, isProcessing,
        value, name /* isEditable, */
    } = {}) => {
        const {
            isEditMode,
            colorMode,
            id,
            isEditable
        } = this.props;
        const styles = style(colorMode);
        const PressableComponent = !isEditMode ? Pressable : View;

        return (
            <View style={[ styles?.relayContainer, { opacity: isEditMode ? EDIT_MODE_OPACITY : 1 } ]}>
                <PressableComponent
                    disabled = {isEditMode}
                    style    = {styles.siriIcon}
                    onPress  = {this.handleOpenInstructionsScreen({ topic, name })}
                >
                    <SvgIcon
                        color = {colors[colorMode].PRIMARY}
                        size  = {20}
                        type  = {isIOS ? 'keyboardVoice' : 'eventNote'}
                    />
                </PressableComponent>
                <Text
                    numberOfLines = {1}
                    style         = {[ styles.name, styles.relayName ]}
                >
                    {name}
                </Text>

                <PressableComponent style={styles.buttonWrapper}>
                    <PushButton
                        {...BUTTON_PROPS}
                        id           = {id}
                        value        = {value}
                        topic        = {instance ? topic : void 0}
                        size         = 'small'
                        isProcessing = {isProcessing}
                        isEditable   = {isEditable}
                        isEditMode   = {isEditMode}
                    />
                </PressableComponent>
            </View>
        );
    }

    handleOpenNameModal = () => {
        const { onSetModalState, name, id, t } = this.props;

        onSetModalState({
            id,
            value     : name,
            isVisible : true,
            onDismiss : this.handleDismissNameModal,
            onSave    : this.handleFinishEditName,
            props     : {
                label     : t('Access point name'),
                maxLength : 20
            }
        });
    }

    handleDismissNameModal = () => {
        const { onSetModalState } = this.props;

        onSetModalState({});
    }

    renderHeading = ({ withSettings = false } = {}) => {
        const {
            colorMode,
            name,
            status,
            accessCamera: {
                isShowCameraIcon = false
            } = {},
            isEditMode
        } = this.props;
        const { localName, isProcessing } = this.state;
        const styles = style(colorMode);

        return (
            <View style={[ styles.heading ]}>
                <View style={styles.leftPart}>
                    <View style={[ styles.statusWrapper, { opacity: isEditMode ? EDIT_MODE_OPACITY : 1 } ]}>
                        <AccessPointStatus  state={status} colorMode={colorMode} />
                    </View>
                    <Text style={styles.name} numberOfLines={1}>
                        {localName || name}
                    </Text>
                </View>
                <View style = {styles.rightPart}>
                    { isEditMode
                        ? (
                            <>
                                { isProcessing
                                    ? (
                                        <View style   = {[ styles.iconControlWrapper, { borderColor: 'transparent', marginRight: 5 } ]}>
                                            <ActivityIndicator color={colors[colorMode].PRIMARY} size='small' />
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style   = {[ styles.iconControlWrapper, { borderColor: 'transparent', marginRight: 5 } ]}
                                            onPress = {this.handleOpenNameModal}
                                        >
                                            <SvgIcon
                                                color  = {colors[colorMode].TEXT_PRIMARY}
                                                width  = {21}
                                                height = {21}
                                                type   = 'edit'
                                            />
                                        </TouchableOpacity>
                                    )
                                }
                                <View
                                    style ={[ styles.iconControlWrapper, { borderColor: 'transparent' } ]}
                                >
                                    <SvgIcon
                                        type   = 'dnd'
                                        width  = {27}
                                        height = {12}
                                        color  = {colors.GREY_MEDIUM}
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                { isShowCameraIcon
                                    ? (
                                        <TouchableOpacity
                                            style   = {[ styles.iconControlWrapper, { marginRight: 12 } ]}
                                            onPress = {this.handleOpenCameraStream}
                                        >
                                            <SvgIcon
                                                color  = {colors[colorMode].PRIMARY}
                                                width  = {20}
                                                height = {20}
                                                type   = 'camera'
                                            />
                                        </TouchableOpacity>
                                    ) : null
                                }
                                { withSettings
                                    ? (
                                        <TouchableOpacity
                                            style   = {styles.iconControlWrapper}
                                            onPress = {this.handleOpenSettingsModal}
                                        >
                                            <SvgIcon
                                                color = {colors[colorMode].PRIMARY}
                                                width = {15}
                                                type  = 'settingsEllipsis'
                                            />
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </>
                        )
                    }
                </View>
            </View>
        );
    }

    renderDisplayedTopic = ({
        topicsAmount,
        instance,
        title,
        index
    } = {}) => {
        const { colorMode, t, isEditMode } = this.props;
        const styles = style(colorMode);
        const isOpened = [ 'true', true ]?.includes(instance?.value);
        const statusColor = isOpened ? colors[colorMode].SALAD : colors[colorMode].ERROR;

        return (
            <View
                style={[
                    styles.displayedTopic,
                    { width: topicsAmount > 1 ? '49%' : '100%' },
                    { opacity: isEditMode ? EDIT_MODE_OPACITY : 1 }
                ]}
            >
                <View
                    style={[
                        styles.topicContent,
                        index === 0 && topicsAmount > 1 ? [
                            { borderRightWidth: 1, borderColor: colors[colorMode].DIVEDER_COLOR }
                        ] : []
                    ]}
                >
                    <Text style={{ color: statusColor, fontSize: 12, marginBottom: 2 }}>
                        { isOpened ? t('Open sensor') : t('Close sensor') }
                    </Text>
                    <Text variant='caption1' style={{ fontSize: 12, fontWeight: '500' }}>
                        {`${t('Doors sensor')} ${title}`}
                    </Text>
                </View>
            </View>
        );
    }

    renderDisplayedTopics = () => {
        const { displayedTopics, colorMode } = this.props;
        const styles = style(colorMode);
        const topics = displayedTopics?.filter((topic) => !this.checkIsRelayTopic(topic));

        if (!topics?.length) return null;

        return (
            <View style={styles.displayedTopics}>
                <Topics
                    topics     = {topics}
                    renderItem = {this.renderDisplayedTopic}
                />
            </View>
        );
    }

    render() {
        const {
            colorMode, isEditMode, onDrag, id,
            name, displayedTopics, topic, phone, onPress,
            containerStyle
        } = this.props;
        const { showSettingsModal } = this.state;
        const styles = style(colorMode);

        const withRelays = !!displayedTopics?.filter(this.checkIsRelayTopic)?.length;
        const withTopics = !!displayedTopics?.filter((t, index) => !this.checkIsRelayTopic(t, index))?.length;
        const withFirstDivider = withRelays || withTopics;
        const withSecondDivider = withRelays && withTopics;
        const siriShortcuts = getShortcuts({ topic, name });

        const withSettings = isIOS ? !!(siriShortcuts?.length || phone) : !!phone;

        return (
            <BorderedBlock
                style = {{ ...styles.borderedBlock, ...(containerStyle || {}) }}
                withShadow
            >
                <Pressable
                    style         = {[ styles.container ]}
                    onLongPress   = {this.handleShowName}
                    onPress       = {onPress}
                    {...isEditMode && { onPressIn: onDrag }}
                >
                    {this.renderHeading({ withSettings })}
                    {this.renderAccessControl()}
                    { withFirstDivider ? <Divider containerStyle={[ styles.divider, { marginBottom: 8 } ]} /> : null}
                    {withRelays ? this.renderRelays() : null}
                    {withSecondDivider
                        ? <Divider containerStyle={[ styles.divider, { marginTop: 8, marginBottom: 8 } ]} />
                        : null
                    }
                    {withTopics ? this.renderDisplayedTopics() : null}
                </Pressable>
                <SettingsModal
                    key            = {id}
                    name           = {name}
                    onDismiss      = {this.handleCloseSettingsModal}
                    onOpen         = {this.handleOpenSettingsModal}
                    isVisible      = {showSettingsModal}
                    shortcuts      = {isIOS ? siriShortcuts : void 0}
                    phone          = {phone}
                    onOpenCallMenu = {this.handleOpenCallMenu}
                />
            </BorderedBlock>
        );
    }
}

export default withTranslation()(connectActionSheet(AccessPointBtn));
