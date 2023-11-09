/* eslint-disable react/prop-types */
import React, { PureComponent }         from 'react';
import PropTypes                        from 'prop-types';
import { View }                         from 'react-native';
import { connect }                      from 'react-redux';
import { withTranslation }              from 'react-i18next';

import * as homieActions                from '../../../actions/homie/homie';
import { getAccessPointById }           from '../../../selectors/homie';
import screens                          from '../../../new-assets/constants/screens';
import colors                           from '../../../new-assets/constants/colors';

import { withNoConnectionMessage }      from '../../hoc/withNoConnectionMessage';

import Camera                           from '../../new-ui-kit/Camera';
import PushButton                       from '../../new-ui-kit/PushButton';
import BorderedBlock                    from '../../new-ui-kit/BorderedBlock';
import TouchableBlock                   from '../../new-ui-kit/TouchableBlock';
import Text                             from '../../new-ui-kit/Text';

import style                            from './CameraStreamScreenStyles';


class CameraStreamScreen extends PureComponent {
    static propTypes = {
        colorMode   : PropTypes.string.isRequired,
        route       : PropTypes.object.isRequired,
        accessPoint : PropTypes.object.isRequired,
        navigation  : PropTypes.object.isRequired
    }

    state = {
        errors       : {},
        isFullscreen : false
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.addListener('beforeRemove', this.goBackListener);
    }

    componentWillUnmount() {
        const {  navigation } = this.props;

        navigation.removeListener('beforeRemove', this.goBackListener);
    }

    handleChangeFullscreen = () => {
        this.setState({
            isFullscreen : !this.state.isFullscreen
        });
    }

    goBackListener = e => {
        const { route, navigation } = this.props;
        const previousScreen = route?.params?.previousScreen || screens.ACCESS_POINTS;

        if (previousScreen) {
            e.preventDefault();

            return navigation.navigate(previousScreen, {
                previousScreen : screens.CAMERA_STREAM
            });
        }
    }

    render() {
        const {
            colorMode,
            route,
            t,
            navigation,
            accessPoint : {
                isValueProcessing,
                value,
                isEditable,
                accessCamera
            }
        } = this.props;
        const {
            pushButtonProps : {
                topic
            },
            accessCameraProps : {
                rtspUrl,
                poster
            }
        } = route.params;
        const cameraStatus = accessCamera?.cameraStatus || '';
        const isCameraActive = cameraStatus === 'ready';
        const cameraStatusColor = isCameraActive ? colors[colorMode].SALAD : colors[colorMode].ERROR;
        const { isFullscreen } = this.state;
        const styles = style(colorMode);

        return (
            <View
                style = {{
                    ...styles.container,
                    ...isFullscreen ? styles.fullscreenContainer : {}
                }}
            >
                <Camera
                    rtspUrl            = {rtspUrl}
                    poster             = {poster}
                    colorMode          = {colorMode}
                    onToggleFullscreen = {this.handleChangeFullscreen}
                    isFullscreen       = {isFullscreen}
                    navigation         = {navigation}
                />
                { !isFullscreen
                    ? (
                        <>
                            <BorderedBlock containerStyle={styles.borderedBlock} variant='secondary'>
                                <TouchableBlock
                                    title               = {`${t('Cameras status')  }:`}
                                    value               = {'true'}
                                    size                = 'S'
                                    withArrow           = {false}
                                    containerStyle      = {styles.block}
                                    renderCustomContent = {() => {  // eslint-disable-line
                                        return (
                                            <View style={styles.blockContent}>
                                                <Text style={styles.blockTitle}>
                                                    {`${t('Cameras status')}:`}
                                                </Text>
                                                <View style={styles.blockValueWrapper}>
                                                    <Text
                                                        style={[ styles.blockValue, { color: cameraStatusColor } ]}
                                                    >
                                                        {isCameraActive ? t('Online') : t('Offline')}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    }}
                                    isTransparent
                                />
                            </BorderedBlock>
                            <View style = {styles.openButtonWrapper}>
                                <PushButton
                                    value        = {value}
                                    topic        = {topic}
                                    size         = 'big'
                                    isProcessing = {isValueProcessing}
                                    isEditable   = {isEditable}
                                />
                            </View>
                        </>
                    ) : null
                }
            </View>
        );
    }
}

export default withNoConnectionMessage(
    connect((state, ownProps) => ({
        colorMode   : state.theme.mode,
        accessPoint : getAccessPointById(
            state,
            ownProps.route.params.pushButtonProps.id
        )
    }), { ...homieActions }
    )(withTranslation()(CameraStreamScreen))
);
