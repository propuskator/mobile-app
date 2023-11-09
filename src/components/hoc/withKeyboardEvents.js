import React                                    from 'react';
import { Keyboard, LayoutAnimation, UIManager } from 'react-native';

import { isIOS }                                from '../../utils/platform';

export function withKeyboardEvents(Component, useLayoutAnimation = false) {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
            this.handleKeyboardHide = this.handleKeyboardHide.bind(this);

            this.state = {
                isKeyboardVisible : false,
                startCoordinates  : 0,
                keyboardHeight    : 0,
                keyboardDuration  : 0
            };
        }

        componentDidMount() {
            if (isIOS) {
                Keyboard.addListener('keyboardWillShow', this.handleKeyboardShow);
                Keyboard.addListener('keyboardWillHide', this.handleKeyboardHide);
            } else {
                Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
                Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
            }
        }

        componentWillUnmount() {
            if (isIOS) {
                Keyboard.removeAllListeners([ 'keyboardWillShow', 'keyboardWillHide' ]);
            } else {
                Keyboard.removeAllListeners([ 'keyboardDidShow', 'keyboardDidHide' ]);
            }
        }

        handleKeyboardShow(e) {
            const { duration } = e;
            const { height, screenY } = e.endCoordinates;
            const outputHeight = isIOS ? height : height + 25;

            this.configureLayoutAnimation();

            this.setState({
                keyboardHeight    : outputHeight,
                startCoordinates  : screenY,
                isKeyboardVisible : true,
                keyboardDuration  : duration
            });
        }

        handleKeyboardHide({ duration }) {
            this.configureLayoutAnimation();
            this.setState({ keyboardHeight: 0, isKeyboardVisible: false, keyboardDuration: duration });
        }

        configureLayoutAnimation = () => {
            if (useLayoutAnimation) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

                if (UIManager.setLayoutAnimationEnabledExperimental) {
                    UIManager.setLayoutAnimationEnabledExperimental(true);
                }
            }
        }

        render() {
            const { isKeyboardVisible, keyboardHeight, startCoordinates, keyboardDuration } = this.state;

            return (
                <Component
                    {...this.props}
                    isKeyboardVisible = {isKeyboardVisible}
                    keyboardHeight    = {keyboardHeight}
                    startCoordinates  = {startCoordinates}
                    keyboardDuration  = {keyboardDuration}
                />
            );
        }
    };
}
