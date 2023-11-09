import React, { Component }                  from 'react';
import PropTypes                             from 'prop-types';
import {
    View,
    Pressable,
    TouchableOpacity,
    Linking
}                                            from 'react-native';
import { withTranslation }                   from 'react-i18next';
import { connectActionSheet }                from '@expo/react-native-action-sheet';

import Text                                  from '../../ui-kit/Text';
import PushButton                            from '../../ui-kit/PushButton';
import Status                                from '../../ui-kit/Status';
import Icon                                  from '../../ui-kit/Icon';

import DragIcon                              from '../../../assets/static_icons/drag.svg';
import EditIcon                              from '../../../assets/static_icons/edit_control_icon.svg';

import screens                               from '../../../assets/constants/screens';
import colors                                from '../../../assets/constants/colors';
import toast                                 from '../../../utils/Toast';
import * as NavigationHelper                 from '../../../utils/NavigationHelper';
import { getShortcuts }                       from '../../../utils/siri';
import { isIOS }                             from '../../../utils/platform';

import TopicStates                           from './TopicStates';
import Relays                                from './Relays';

import style                                 from './AccessPointBtnStyles.js';

const BUTTON_PROPS = {
    titleProps : { allowFontScaling: false }
};

class AccessPointBtn extends Component {
    static propTypes = {
        value                      : PropTypes.bool,
        name                       : PropTypes.string.isRequired,
        status                     : PropTypes.string.isRequired,
        handleOpenAccess           : PropTypes.func.isRequired,
        topic                      : PropTypes.string.isRequired,
        onOpenEditInput            : PropTypes.func,
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
        displayedTopics : PropTypes.array.isRequired
    };

    static defaultProps = {
        isProcessing    : false,
        isEditable      : true,
        isEditMode      : false,
        isExist         : false,
        value           : false,
        phone           : '',
        onOpenEditInput : void 0,
        onDrag          : () => {},
        containerStyle  : void 0
    };

    handleOpenInstructionsScreen = ({ topic, name }) => () => {
        NavigationHelper.navigate(
            screens.INSTRUCTIONS,
            {
                shortcuts : getShortcuts({ topic, name })
            }
        );
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
    };

    handleOpenCallMenu = () => {
        const { showActionSheetWithOptions, t, phone } = this.props;

        if (!phone) return;
        if (isIOS) return this.openCallMenu();

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
                        break;
                    default:
                        break;
                }
            }
        );
    }

    checkIsRelayTopic = (t) => !!t?.includes('/r/');

    renderPointContent = () => {
        return (
            <>
                {this.renderMainPoint()}
                {this.renderRelays()}
            </>
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
        value, name, /* isEditable, */
        isFirst, isLast
    } = {}) => {
        const {
            isEditMode,
            colorMode,
            containerStyle,
            id,
            isEditable
        } = this.props;
        const styles = style(colorMode);
        const PressableComponent = !isEditMode ? Pressable : View;

        return (
            <View
                style={[
                    styles.container,
                    containerStyle,
                    styles?.relayContainer,
                    isFirst ? styles.firstRelay : void 0,
                    isLast ? styles.lastRelay : void 0
                ]}
            >
                <PressableComponent
                    disabled = {isEditMode}
                    style    = {styles.siriIcon}
                    onPress  = {this.handleOpenInstructionsScreen({ topic, name })}
                >
                    <Icon
                        color = {colors[colorMode].GRAY}
                        size  = {20}
                        name  = {isIOS ? 'keyboard-voice' : 'event-note'}
                        type  = 'material'
                    />
                </PressableComponent>

                <View
                    style         = {{
                        ...styles.nameWrapper,
                        ...isEditMode && { opacity: 0.6 }
                    }}
                >
                    <View style={styles.firstBlock}>
                        <Text
                            numberOfLines = {1}
                            style         = {styles.name}
                        >
                            {name}
                        </Text>
                    </View>
                </View>

                <PressableComponent style={styles.buttonWrapper}>
                    <PushButton
                        {...BUTTON_PROPS}
                        id                  = {id}
                        value               = {value}
                        topic               = {instance ? topic : void 0}
                        //  handleTriggerAccess = {handleTriggerAccess}
                        containerStyle      = {{ marginLeft: 10 }}
                        isProcessing        = {isProcessing}
                        isEditable          = {isEditable}
                    />
                </PressableComponent>
            </View>
        );
    }

    renderMainPoint = () => {
        const {
            name,
            status,
            value,
            isProcessing,
            isEditable,
            isEditMode,
            colorMode,
            onOpenEditInput,
            containerStyle,
            id,
            phone,
            accessCamera: {
                isShowCameraIcon = false
            } = {},
            topic,
            displayedTopics,
            isExistInHomie
        } = this.props;
        const styles = style(colorMode);
        const withRelays = !!displayedTopics?.filter(this.checkIsRelayTopic)?.length;
        const PressableComponent = !isEditMode ? Pressable : View;

        return (
            <View
                style={[
                    styles.container,
                    containerStyle,
                    withRelays ? styles.withRelays : void 0
                ]}
            >
                {isEditMode && <DragIcon style={styles.dragIcon} />}
                {isEditMode &&
                    <TouchableOpacity
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        onPress={onOpenEditInput}
                    >
                        <EditIcon
                            style={styles.editIcon}
                            fill={colors[colorMode].TEXT_SECONDARY_LIGHT}
                        />
                    </TouchableOpacity>
                }
                <Status state = {status} colorMode={colorMode} />

                <PressableComponent
                    disabled = {isEditMode}
                    style    = {styles.siriIcon}
                    onPress  = {this.handleOpenInstructionsScreen({ topic, name })}
                >
                    <Icon
                        color = {colors[colorMode].GRAY}
                        size  = {20}
                        name  = {isIOS ? 'keyboard-voice' : 'event-note'}
                        type  = 'material'
                    />
                </PressableComponent>

                <View
                    style         = {{
                        ...styles.nameWrapper,
                        ...isEditMode && { opacity: 0.6 }
                    }}
                >
                    <View style={styles.firstBlock}>
                        <Text
                            numberOfLines = {1}
                            style         = {styles.name}
                        >
                            {name}
                        </Text>
                    </View>
                    { phone
                        ? (
                            <View style={styles.secondBlock}>
                                <Icon
                                    style = {styles.phoneIcon}
                                    color = {colors[colorMode].GRAY}
                                    size  = {15}
                                    name  = 'phone'
                                    type  = 'material'
                                />
                                <Text
                                    numberOfLines = {1}
                                    style         = {styles.phone}
                                >
                                    {phone}
                                </Text>
                            </View>
                        ) : null
                    }
                </View>

                { isShowCameraIcon
                    ? <PressableComponent
                        style   = {styles.siriIcon}
                        onPress = {this.handleOpenCameraStream}
                        disabled={isEditMode}
                    >
                        <Icon
                            color = {colors[colorMode].GRAY}
                            size  = {28}
                            name  = 'videocam'
                            type  = 'material'
                        />
                    </PressableComponent>
                    : null
                }

                <TopicStates topics={displayedTopics} isExistInHomie={isExistInHomie} />

                <PressableComponent style={styles.buttonWrapper}>
                    <PushButton
                        {...BUTTON_PROPS}
                        id                  = {id}
                        value               = {value}
                        topic               = {topic}
                        //  handleTriggerAccess = {handleTriggerAccess}
                        containerStyle      = {{ marginLeft: 10 }}
                        isProcessing        = {isProcessing}
                        isEditable          = {isEditable}
                    />
                </PressableComponent>
            </View>
        );
    }

    render() {
        const { colorMode, isEditMode, onDrag, phone } = this.props;
        const styles = style(colorMode);

        return (
            <Pressable
                style={[ styles.mainContainer ]}
                {...isEditMode && { onPressIn: onDrag }}
                onLongPress   = {this.handleShowName}
                {...(phone && !isEditMode ? { onPress: this.handleOpenCallMenu } : {})}
            >
                {this.renderPointContent()}
            </Pressable>
        );
    }
}

export default withTranslation()(connectActionSheet(AccessPointBtn));
