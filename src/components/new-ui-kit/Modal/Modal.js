import React, { PureComponent }            from 'react';
import PropTypes                           from 'prop-types';

import {
    View,
    Dimensions,
    Animated,
    Easing,
    Modal,
    PanResponder,
    Pressable,
    TouchableOpacity,
    Keyboard
}                                          from 'react-native';

import { isIOS, wh }                       from '../../../utils/platform';

import Icon                                from '../Icon';
import Text                                from '../Text';

import style                               from './ModalStyles';

const hitSlop = { top: 15, right: 15, bottom: 15, left: 15 };

class CustomModal extends PureComponent {
    static propTypes = {
        withCloseIcon        : PropTypes.bool,
        withKeyboard         : PropTypes.bool,
        header               : PropTypes.string,
        children             : PropTypes.object.isRequired,
        onDismiss            : PropTypes.func,
        onShow               : PropTypes.func,
        leftHeaderComponent  : PropTypes.object,
        rightHeaderComponent : PropTypes.object,
        keyboardHeight       : PropTypes.number.isRequired,
        keyboardDuration     : PropTypes.number.isRequired,
        colorMode            : PropTypes.string.isRequired,
        visible              : PropTypes.bool.isRequired,
        height               : PropTypes.number,
        containerStyle       : PropTypes.object,
        headerStyle          : PropTypes.object,
        headerTitleStyle     : PropTypes.object,
        isUserLogedIn        : PropTypes.bool
    }

    static defaultProps = {
        onDismiss            : () => {},
        onShow               : null,
        leftHeaderComponent  : null,
        rightHeaderComponent : null,
        header               : '',
        withCloseIcon        : true,
        height               : null,
        containerStyle       : void 0,
        headerStyle          : void 0,
        headerTitleStyle     : void 0,
        withKeyboard         : true,
        isUserLogedIn        : false
    }

    constructor(props) {
        super(props);

        this.state = {
            panY               : new Animated.Value(Dimensions.get('screen').height),
            keyboardHeightAnim : new Animated.Value(0)
        };

        this.initAnimation();
    }
    componentDidUpdate(prevProps) {
        const { visible, keyboardHeight,
            isUserLogedIn, onDismiss
        } = this.props;

        if (!isUserLogedIn && prevProps?.isUserLogedIn) {
            return onDismiss && onDismiss();
        }

        if (prevProps.visible !== visible && visible) {
            this.resetPositionAnim.start();
        }

        if (prevProps.keyboardHeight !== keyboardHeight) {
            this.animateKeyboardOffset(keyboardHeight).start();
        }
    }

    initAnimation = () => {
        this.resetPositionAnim = Animated.timing(this.state.panY, {
            toValue         : 0,
            duration        : 250,
            useNativeDriver : false,
            easing          : Easing.ease
        });
        this.closeAnim = Animated.timing(this.state.panY, {
            toValue         : Dimensions.get('screen').height,
            useNativeDriver : false,
            duration        : 350,
            easing          : Easing.ease
        });

        this._panResponders = PanResponder.create({
            onStartShouldSetPanResponder : () => true,
            onMoveShouldSetPanResponder  : () => false,
            onPanResponderMove           : Animated.event([
                null, {  dy: this.state.panY }
            ], { useNativeDriver: false }),
            onPanResponderRelease : (e, gs) => {
                const { keyboardHeight } = this.props;

                if (wh - gs.moveY - keyboardHeight < wh / 4) {
                    Keyboard.dismiss();

                    return this.closeAnim.start(() => this.props.onDismiss());
                }

                return this.resetPositionAnim.start();
            }
        });

        this.resetPositionAnim.start();
    }

    animateKeyboardOffset = () => {
        const { keyboardHeight } = this.props;

        return Animated.spring(this.state.keyboardHeightAnim, {
            toValue         : keyboardHeight,
            bounciness      : 0,
            speed           : 25,
            useNativeDriver : false
        });
    }

    handleDismiss = () => {
        const { onDismiss } = this.props;

        Keyboard.dismiss();
        this.closeAnim.start(() => onDismiss());
    }

    handleShow = () => {
        const { onShow } = this.props;

        if (onShow) onShow();
    }


    render() {
        const {
            leftHeaderComponent,
            header,
            height,
            rightHeaderComponent,
            withCloseIcon,
            colorMode,
            containerStyle,
            headerStyle,
            headerTitleStyle,
            visible,
            keyboardHeight
        } = this.props;

        const { panY, keyboardHeightAnim } = this.state;

        const top = panY.interpolate({
            inputRange  : [ -1, 0, 1 ],
            outputRange : [ 0, 0, 1 ]
        });

        const marginBottom = isIOS ?  keyboardHeightAnim : keyboardHeight;

        const styles = style(colorMode);

        return (
            <Modal
                transparent
                statusBarTranslucent
                animationType   = 'fade'
                visible         = {visible}
                onRequestClose  = {this.handleDismiss}
                onShow          = {this.handleShow}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.overlay} onPress={this.handleDismiss} />

                    <Animated.View
                        style={{
                            ...styles.container,
                            ...containerStyle,
                            ...height ? { height } : {},
                            top,
                            marginBottom
                        }}
                    >
                        <View style={styles.draggableAreaWrapper} {...this._panResponders?.panHandlers || {}}>
                            <View style={styles.draggableArea}  />
                        </View>
                        <View
                            style={{
                                ...styles.headerWrapper,
                                ...headerStyle
                            }}
                        >
                            <View style={styles.leftIconWrapper}>
                                {leftHeaderComponent}
                            </View>

                            <Text
                                style            = {[
                                    styles.header,
                                    headerTitleStyle,
                                    styles.centeredTitle
                                ]}
                                allowFontScaling = {false}
                                numberOfLines    = {1}
                            >
                                {header}
                            </Text>

                            <View style={styles.rightIconWrapper}>
                                { !rightHeaderComponent && withCloseIcon
                                    ? (
                                        <TouchableOpacity
                                            onPress = {this.handleDismiss}
                                            hitSlop = {hitSlop}
                                        >
                                            <Icon type = 'close' />
                                        </TouchableOpacity>
                                    ) : rightHeaderComponent
                                }
                            </View>
                        </View>
                        {this.props.children}
                    </Animated.View>
                </View>
            </Modal>
        );
    }
}

// eslint-disable-next-line react/no-multi-comp
export default CustomModal;
