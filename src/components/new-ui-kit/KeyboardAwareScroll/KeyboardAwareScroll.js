import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import { withTranslation }      from 'react-i18next';

import {
    KeyboardAwareScrollView
}                               from 'react-native-keyboard-aware-scroll-view';

import { withKeyboardEvents }   from '../../hoc/withKeyboardEvents';
import {
    isIOS,
    // isAndroid,
    isIPhone5,
    isIPhone6,
    isIPhone6p

}                               from '../../../utils/platform';


class KeyboardAwareScroll extends PureComponent {
    static propTypes = {
        // navigation : PropTypes.object.isRequired
        keyboardHeight        : PropTypes.number.isRequired,
        children              : PropTypes.object.isRequired,
        style                 : PropTypes.object.isRequired,
        contentContainerStyle : PropTypes.object.isRequired
    }


    render() {
        const { children, keyboardHeight, style, contentContainerStyle, ...restProps } = this.props;

        return (
            <KeyboardAwareScrollView
                contentContainerStyle        ={[
                    contentContainerStyle,
                    isIOS  && keyboardHeight && {
                        marginBottom : (isIPhone5 || isIPhone6 || isIPhone6p)
                            ? keyboardHeight
                            : keyboardHeight - 30
                    }
                    // isAndroid &&  { marginBottom: 20 }
                ]}
                style                        = {style}
                showsVerticalScrollIndicator = {false}
                keyboardShouldPersistTaps    = 'handled'
                // extraHeight                  = {20}
                // extraScrollHeight            = {isIOS ? 60 : 40}
                enableOnAndroid
                keyboardOpeningTime={Number.MAX_SAFE_INTEGER}

                {...restProps}
            >
                {children}
            </KeyboardAwareScrollView>
        );
    }
}

export default withKeyboardEvents(connect(
    state => ({
        colorMode : state.theme.mode
    }),
    null
)(withTranslation()(KeyboardAwareScroll)));
