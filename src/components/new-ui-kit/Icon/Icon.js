import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { TouchableOpacity }         from 'react-native-gesture-handler';
import { connect }                  from 'react-redux';

import colors                       from '../../../new-assets/constants/colors';
import CopyIcon                     from '../../../new-assets/icons/copy.svg';
import AddIcon                      from '../../../new-assets/icons/add.svg';
import ArrowLeft                    from '../../../new-assets/icons/arrow-left.svg';
import ArrowRight                   from '../../../new-assets/icons/arrow-right.svg';
import ArrowDown                    from '../../../new-assets/icons/arrow-down.svg';
import Check                        from '../../../new-assets/icons/check.svg';
import Close                        from '../../../new-assets/icons/close.svg';
import EyeActive                    from '../../../new-assets/icons/eye-active.svg';
import EyeDefault                   from '../../../new-assets/icons/eye-default.svg';
import Favorite                     from '../../../new-assets/icons/favorite.svg';
import Lock                         from '../../../new-assets/icons/lock.svg';
import Unlock                       from '../../../new-assets/icons/unlock.svg';
import Mic                          from '../../../new-assets/icons/mic.svg';
import Notification                 from '../../../new-assets/icons/notification.svg';
import Search                       from '../../../new-assets/icons/search.svg';
import Settings                     from '../../../new-assets/icons/setting.svg';
import Wifi                         from '../../../new-assets/icons/wifi.svg';
import EmptyBox                     from '../../../new-assets/icons/empty-box.svg';

import EmptySearch                  from '../../../new-assets/icons/empty-search.svg';
import CheckDone                    from '../../../new-assets/icons/check-done.svg';
import Others                       from '../../../new-assets/icons/others.svg';
import Sandbox                      from '../../../new-assets/icons/sandbox.svg';
import Logo                         from '../../../new-assets/icons/logo.svg';
import Pencil                       from '../../../new-assets/icons/pencil.svg';
import Edit                         from '../../../new-assets/icons/edit.svg';
import Dots                         from '../../../new-assets/icons/dots.svg';

import CheckedWithCircle            from '../../../new-assets/icons/checked-circle.svg';
import PendingWithCircle            from '../../../new-assets/icons/pending-circle.svg';
import CloseWithCircle              from '../../../new-assets/icons/close-circle.svg';

import Clock                        from '../../../new-assets/icons/clock.svg';
import Trash                        from '../../../new-assets/icons/trash.svg';
import Call                         from '../../../new-assets/icons/call.svg';

import DropDown                     from '../../../new-assets/icons/arrowDropDown.svg';

import BulbIcon                     from '../../../new-assets/icons/bulbIcon.svg';
import BulbOn                       from '../../../new-assets/icons/bulbOn.svg';
import BulbOff                      from '../../../new-assets/icons/bulbOff.svg';

import DnD                          from '../../../new-assets/icons/dnd.svg';
import EmptyDeviceLight             from '../../../new-assets/images/PicNoDevices.svg';
import EmptyDeviceDark              from '../../../new-assets/images/PicNoDevicesDark.svg';
import LogoSmall                    from '../../../new-assets/icons/logo_small.svg';
import QuestionWithCircle           from '../../../new-assets/icons/question-circle.svg';
import InfoWithCircle               from '../../../new-assets/icons/info-circle.svg';
import FaceId                       from '../../../new-assets/icons/faceid.svg';
import TouchId                      from '../../../new-assets/icons/touchid.svg';

import SettingsTab                  from '../../../new-assets/icons/tabs/settings.svg';
import SettingsActiveTab            from '../../../new-assets/icons/tabs/settings_active.svg';
import AccessPointsTab              from '../../../new-assets/icons/tabs/access_points.svg';
import AccessPointsTabDark          from '../../../new-assets/icons/tabs/access_points_dark.svg';
import AccessPointsActiveTab        from '../../../new-assets/icons/tabs/access_points_active.svg';

import CameraPlayArrow              from '../../../new-assets/icons/camera/play_arrow.svg';
import CameraPause                  from '../../../new-assets/icons/camera/pause.svg';
import CameraEnhance                from '../../../new-assets/icons/camera/enhance.svg';
import Fullscreen                   from '../../../new-assets/icons/camera/fullscreen.svg';
import FullscreenExit               from '../../../new-assets/icons/camera/fullscreen_exit.svg';

import Refresh                      from '../../../new-assets/icons/refresh.svg';
import Camera                       from '../../../new-assets/icons/camera.svg';
import SettingsEllipsis             from '../../../new-assets/icons/settings-ellipsis.svg';
import EventNote                    from '../../../new-assets/icons/event-note.svg';
import KeyboardVoice                from '../../../new-assets/icons/keyboard-voice.svg';
import SuccessCircle                from '../../../new-assets/icons/success-circle.svg';
import SuccessCircleFilled          from '../../../new-assets/icons/success-circle-filled.svg';
import WaitingCircle                from '../../../new-assets/icons/waiting-circle.svg';
import Exit                         from '../../../new-assets/icons/exit.svg';

import { debounce }                 from '../../../utils';
import styles                       from './IconStyles.js';


const TABS_ICONS = {
    settingsTab           : SettingsTab,
    settingsActiveTab     : SettingsActiveTab,
    accessPointsTab       : AccessPointsTab,
    accessPointsTabDark   : AccessPointsTabDark,
    accessPointsActiveTab : AccessPointsActiveTab
};

const CAMERA_ICONS = {
    cameraPlayArrow : CameraPlayArrow,
    cameraPause     : CameraPause,
    cameraEnhance   : CameraEnhance,
    fullscreen      : Fullscreen,
    fullscreenExit  : FullscreenExit
};

const ICON_TYPES = {
    ...TABS_ICONS,
    ...CAMERA_ICONS,
    copyIcon            : CopyIcon,
    add                 : AddIcon,
    arrowLeft           : ArrowLeft,
    arrowRight          : ArrowRight,
    check               : Check,
    close               : Close,
    eyeActive           : EyeActive,
    eyeDefault          : EyeDefault,
    favorite            : Favorite,
    lock                : Lock,
    mic                 : Mic,
    notification        : Notification,
    search              : Search,
    settings            : Settings,
    wifi                : Wifi,
    emptyBox            : EmptyBox,
    emptySearch         : EmptySearch,
    arrowDown           : ArrowDown,
    checkDone           : CheckDone,
    others              : Others,
    sandbox             : Sandbox,
    logo                : Logo,
    pencil              : Pencil,
    arrowDropDown       : DropDown,
    checkedWithCircle   : CheckedWithCircle,
    pendingWithCircle   : PendingWithCircle,
    closeWithCircle     : CloseWithCircle,
    clock               : Clock,
    dots                : Dots,
    trash               : Trash,
    call                : Call,
    bulb                : BulbIcon,
    bulbOn              : BulbOn,
    bulbOff             : BulbOff,
    dnd                 : DnD,
    emptyDevicelight    : EmptyDeviceLight,
    emptyDevicedark     : EmptyDeviceDark,
    logoSmall           : LogoSmall,
    questionCircle      : QuestionWithCircle,
    infoCircle          : InfoWithCircle,
    faceId              : FaceId,
    touchId             : TouchId,
    refresh             : Refresh,
    unlock              : Unlock,
    camera              : Camera,
    settingsEllipsis    : SettingsEllipsis,
    keyboardVoice       : KeyboardVoice,
    eventNote           : EventNote,
    successCircle       : SuccessCircle,
    successCircleFilled : SuccessCircleFilled,
    waitingCircle       : WaitingCircle,
    edit                : Edit,
    exit                : Exit
};

class CustomIcon extends PureComponent {
    static propTypes = {
        type      : PropTypes.string,
        light     : PropTypes.bool,
        style     : PropTypes.object,
        colorMode : PropTypes.string.isRequired,
        color     : PropTypes.string,
        iconStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        onPress : PropTypes.func,
        size    : PropTypes.number,
        width   : PropTypes.number,
        height  : PropTypes.number
    }


    static defaultProps = {
        type      : 'copyIcon',
        light     : false,
        style     : void 0,
        onPress   : void 0,
        color     : void 0,
        iconStyle : void 0,
        size      : null,
        width     : null,
        height    : null
    }


    handlePress = debounce(() => {
        const { onPress } = this.props;

        if (!onPress) return;

        onPress();
    }, 300, true);


    render() {
        const {
            onPress,
            colorMode,
            color,
            type,
            light,
            style,
            size,
            width,
            height,
            iconStyle,
            ...rest
        } = this.props;

        const Icon = ICON_TYPES[type];
        const iconColor = color ||
            (light
                ? colors[colorMode].DEFAULT_LIGHT_ICON_COLOR
                : colors[colorMode].DEFAULT_ICON_COLOR);
        const touchableStyle = {
            ... onPress ?  styles.buttonStyle : {},
            ...style
        };

        if (!Icon) return null;

        return (
            <TouchableOpacity
                style         = {touchableStyle}
                activeOpacity = {onPress ? 0.5 : 1}
                onPress       = {this.handlePress}
            >
                <Icon
                    {...rest}
                    style = {{
                        color : iconColor,
                        ...(iconStyle || {})
                    }}
                    fill  = {iconColor}
                    {...size ? { width: size, height: size } : {}}
                    {...width ? { width }  : {}}
                    {...height ? { height } : {}}
                />
            </TouchableOpacity>

        );
    }
}


export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(CustomIcon);

