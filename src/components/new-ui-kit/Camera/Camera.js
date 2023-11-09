import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { VLCPlayer }            from 'react-native-vlc-media-player';
import {
    StatusBar,
    View,
    Pressable,
    ActivityIndicator,
    AppState,
    Image,
    TouchableOpacity,
    Alert,
    PermissionsAndroid, Platform
}                               from 'react-native';
import CameraRoll               from '@react-native-community/cameraroll';
import { captureRef }           from 'react-native-view-shot';

import { withTranslation }      from 'react-i18next';

import config                   from '../../../config';
import { generateRandomString } from '../../../utils';
import colors                   from '../../../new-assets/constants/colors';
import Text                     from '../../new-ui-kit/Text';
import Icon                     from '../../new-ui-kit/Icon';

import {
    isAppStateActiveAfterBackground,
    isAppStateSwitchToBackground
}                               from '../../../utils/appState';
import { ww, wh }               from '../../../utils/platform';

import styles                   from './CameraStyles';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const AVAILABLE_HEIGHT  = wh - STATUS_BAR_HEIGHT;

const CAMERA_GREY = '#BEBEBE';
const ERROR_TEXT_COLOR = '#FFF';

const EROOR_TIMEOUT = 60000;
const INTIAL_STATE = {
    bufferNumber  : 0,
    isLoading     : true,
    isPaused      : false,
    isError       : false,
    isPosterError : false,
    posterId      : generateRandomString()
};

class Camera extends PureComponent {
    static propTypes = {
        rtspUrl            : PropTypes.string.isRequired,
        t                  : PropTypes.func.isRequired,
        poster             : PropTypes.string,
        colorMode          : PropTypes.string.isRequired,
        onToggleFullscreen : PropTypes.func.isRequired,
        isFullscreen       : PropTypes.bool,
        navigation         : PropTypes.object.isRequired
    }

    static defaultProps = {
        poster       : void 0,
        isFullscreen : false
    };

    constructor(props) {
        super(props);

        this.appState = 'active';
        this.state = INTIAL_STATE;
    }


    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }


    handleAppStateChange = async  nextAppState => {
        const isGoToBackground = isAppStateSwitchToBackground(this.appState, nextAppState);
        const isActiveAfterBackground = isAppStateActiveAfterBackground(this.appState, nextAppState);

        if (isActiveAfterBackground) this.setState({ isPaused: false });
        else if (isGoToBackground) this.setState({ isPaused: true });


        this.appState = nextAppState;
    }


    handleBuffering = (interval = 600, diffTime = 1000) => () => {
        this.setState({
            isLoading    : true,
            isError      : false,
            bufferNumber : this.state.bufferNumber + 1
        });
        this.bufferTime = new Date().getTime();
        if (!this.bufferInterval) {
            this.bufferInterval = setInterval(this.bufferIntervalFunction(diffTime), interval);
        }
    }


    bufferIntervalFunction = (time) => () => {
        const currentTime      = new Date().getTime();
        const diffTime         = currentTime - this.bufferTime;
        const { bufferNumber } = this.state;

        if (diffTime > time) {
            clearInterval(this.bufferInterval);
            if (bufferNumber !== 1) {
                this.setState({
                    isPaused  : false,
                    isLoading : false
                });
            }

            this.bufferInterval = null;
        }
    };

    handleRefreshStream = () => {
        this.setState({
            ...INTIAL_STATE,
            posterId : generateRandomString(),
            streamId : generateRandomString()
        });
    }

    handleRulePlayer = () => {
        this.setState({
            isPaused : !this.state.isPaused
        });
    }

    handlePosterLoadError = () => {
        this.setState({
            isPosterError : true
        });
    }

    handleLoadStart = () => {
        this.setState({
            isLoading : true
        });
        setTimeout(() => {
            if (this.state.isLoading) {
                this.setState({
                    isError   : true,
                    isLoading : false
                });
            }
        }, EROOR_TIMEOUT);
    }


    checkAndroidPermission = async () => {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

            const hasPermission = await PermissionsAndroid.check(permission);

            if (hasPermission) {
                return true;
            }

            const status = await PermissionsAndroid.request(permission);

            return status === 'granted';
        } catch (err) {
            console.log(err);
        }
    }

    handleSavePicture = async (uri) => {
        const { t } = this.props;

        try {
            if (Platform.OS === 'android' && !(await this.checkAndroidPermission())) {
                return;
            }

            await CameraRoll.save(uri);
            Alert.alert(
                t('Snapshot has been created'),
                t('Please check yout gallery')
            );
        } catch (err) {
            Alert.alert(
                t(err.name),
                t(err.message)
            );
        }
    }

    handleToggleFullscreen = () => {
        const { isFullscreen, navigation } = this.props;

        navigation.setOptions({
            headerShown : isFullscreen
        });

        this.props.onToggleFullscreen();
    }

    handleGetSnapshot = async  () => {
        const { t } = this.props;

        try {
            const ref =  Platform.OS === 'android' ? this.androidRef : this.iosRef;
            const uri = await captureRef(ref, {    // eslint-disable-line  more/no-then
                format  : 'jpg',
                quality : 0.9
            });

            await this.handleSavePicture(uri);
        } catch (err) {
            console.log(err);
            Alert.alert(
                t('Snapshot hasn\'t been created'),
                t('Something went wrong. Please try again later')
            );
        }
    }

    handleError = () => {
        this.setState({
            isError   : true,
            isLoading : false,
            isPaused  : false
        });
    }

    render() {
        const {
            isLoading, isPaused, isError, isPosterError,
            posterId, streamId
        } = this.state;
        const { rtspUrl, t, poster, colorMode, isFullscreen } = this.props;
        const posterUrl = poster
            ? `${config.API_URL}/${poster}`
            : void 0;
        const style = styles(colorMode);

        return (
            <View
                ref   = {node => this.androidRef = node}
                style = {{
                    ...style.cameraWrapper,
                    ...(isFullscreen ? {
                        width          : AVAILABLE_HEIGHT,
                        height         : ww,
                        display        : 'flex',
                        alignItems     : 'center',
                        justifyContent : 'center',
                        zIndex         : 2,
                        transform      : [ { rotate: '90deg' } ]
                    } : {})
                }}
            >
                <VLCPlayer
                    key  = {streamId}
                    ref  = {node => this.iosRef = node}
                    isLive
                    autoplay
                    autoReloadLive
                    style = {{
                        height : '100%',
                        width  : '100%',
                        ...(isFullscreen ? {
                            width  : AVAILABLE_HEIGHT,
                            height : ww
                        } : {})
                    }}
                    paused      = {isPaused}
                    onError     = {this.handleError}
                    onBuffering = {this.handleBuffering()}
                    onLoadStart = {this.handleLoadStart}
                    source      = {{ uri: rtspUrl }}
                    resizeMode  = 'contain'
                    {...!isFullscreen ? { videoAspectRatio: '16 : 9' } : { autoAspectRatio: true }}
                />

                { !isLoading && !isError &&
                    <View style={style.controlsWrapper}>
                        <Pressable
                            onPress = {this.handleRulePlayer}
                            style   = {style.playerButton}
                        >
                            <Icon
                                color = {CAMERA_GREY}
                                size  = {28}
                                type  = {isPaused ?  'cameraPlayArrow' : 'cameraPause'}
                            />
                        </Pressable>
                        <Pressable
                            onPress = {this.handleGetSnapshot}
                            style   = {style.cameraButton}
                        >
                            <Icon
                                color = {CAMERA_GREY}
                                size  = {28}
                                type  = {'cameraEnhance'}
                            />
                        </Pressable>
                        <Pressable
                            onPress = {this.handleToggleFullscreen}
                            style   = {style.fullscreenButton}
                        >
                            <Icon
                                color = {CAMERA_GREY}
                                size  = {28}
                                type  = {isFullscreen ? 'fullscreenExit' : 'fullscreen'}
                            />
                        </Pressable>
                    </View>
                }
                { isError &&
                    <TouchableOpacity
                        style   = {style.fadeWrapper}
                        onPress = {this.handleRefreshStream}
                    >
                        <View style   = {style.errorMessageWrapper}>
                            <Icon
                                color = {ERROR_TEXT_COLOR}
                                style = {{ marginBottom: 10 }}
                                size  = {20}
                                type  = 'refresh'
                            />
                            <View style={style.firstMessagePart}>
                                <Text style={[ style.errorMessage, { color: ERROR_TEXT_COLOR } ]}>
                                    {t('Error play video,')}
                                </Text>
                            </View>
                            <Text style={[ style.errorMessage, { color: ERROR_TEXT_COLOR } ]}>
                                {t('please try again')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
                { isLoading
                    ? <View
                        style={{
                            ...style.fadeWrapper,
                            ...(isFullscreen ? {
                                width  : AVAILABLE_HEIGHT,
                                height : ww
                            } : {})
                        }}
                    >
                        { posterUrl && !isPosterError
                            ? (
                                <Image
                                    style   = {style.cameraPreview}
                                    onError = {this.handlePosterLoadError}
                                    source  = {{
                                        uri : `${posterUrl}?cache-killer=${posterId}`
                                    }}
                                    resizeMode = 'cover'
                                />
                            ) : null
                        }
                        <ActivityIndicator  size='large' color={colors[colorMode].GRAY} />
                    </View>
                    : null
                }
            </View>
        );
    }
}

export default withTranslation()(Camera);
