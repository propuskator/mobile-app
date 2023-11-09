import React, { PureComponent } from 'react';
import {
    View
}                               from 'react-native';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import { withTranslation }      from 'react-i18next';

import Text                     from '../../Text';
import Button                   from '../../Button';
import Modal                    from '../../Modal';

import style                    from './InfoModalStyles';

class InfoModal extends PureComponent {
    static propTypes = {
        colorMode   : PropTypes.string.isRequired,
        onDismiss   : PropTypes.func.isRequired,
        isVisible   : PropTypes.bool.isRequired,
        t           : PropTypes.func.isRequired,
        title       : PropTypes.string.isRequired,
        description : PropTypes.string.isRequired
    };

    render() {
        const {
            colorMode, onDismiss, isVisible, t,
            title, description
        } = this.props;
        const styles = style(colorMode);

        return (
            <Modal
                height        = {250}
                header        = {title}
                visible       = {isVisible}
                colorMode     = {colorMode}
                onDismiss     = {onDismiss}
                withKeyboard
                withCloseIcon
            >
                <View style={styles.contentContainer}>
                    <Text style ={styles.description}>
                        {t(description)}
                    </Text>
                    <Button
                        onPress = {onDismiss}
                        title   = {t('Clear')}
                    />
                </View>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(InfoModal));
