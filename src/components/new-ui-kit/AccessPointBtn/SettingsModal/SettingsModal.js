import React, {
    PureComponent,
    createRef
}                               from 'react';
import {
    View,
    TouchableOpacity
}                               from 'react-native';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import { withTranslation }      from 'react-i18next';
import AddToSiriButton, {
    SiriButtonStyles
}                               from 'react-native-siri-shortcut/AddToSiriButton';
import { presentShortcut }      from 'react-native-siri-shortcut';

import colors                   from '../../../../new-assets/constants/colors';

import Text                     from '../../Text';
import Divider                  from '../../Divider';
import Icon                     from '../../Icon';
import BorderedBlock            from '../../BorderedBlock';
import Modal                    from '../../Modal';
import CopyButton               from '../../CopyButton';

import style                    from './SettingsModalStyles';

class SettingsModal extends PureComponent {
    static propTypes = {
        colorMode      : PropTypes.string.isRequired,
        onDismiss      : PropTypes.func.isRequired,
        onOpen         : PropTypes.func.isRequired,
        isVisible      : PropTypes.bool.isRequired,
        t              : PropTypes.func.isRequired,
        onOpenCallMenu : PropTypes.func.isRequired,
        name           : PropTypes.string.isRequired,
        shortcuts      : PropTypes.array,
        phone          : PropTypes.string
    };

    static defaultProps = {
        shortcuts : void 0,
        phone     : ''
    }

    constructor(props) {
        super(props);

        this.copyButtonRef = createRef();
    }

    componentWillUnmount() {
        if (this.fixSiriModalTimeout) clearTimeout(this.fixSiriModalTimeout);
    }

    getModalHeight = () => {
        const { phone, shortcuts } = this.props;

        if (!phone && shortcuts?.length) return 310;
        if (phone && !shortcuts?.length) return 210;

        return 390;
    }

    handleAddShortcut = (shortcut) => () => {
        const { onDismiss, onOpen } = this.props;

        onDismiss();
        this.fixSiriModalTimeout = setTimeout(() => {
            presentShortcut(shortcut, () => onOpen());
        }, 100);
    }

    handleCopyPhone = () => {
        if (!this.copyButtonRef?.current?.copyValue) return;

        this.copyButtonRef.current.copyValue();
    }

    renderSiriShortcut = (shortcut, index, list) => {
        const { colorMode, name } = this.props;
        const withDivider = list?.length > 1 && index > 0 && index < list?.length;
        const styles = style(colorMode);
        const siriButtonStyle = colorMode === 'dark'
            ? SiriButtonStyles.blackOutline
            : SiriButtonStyles.whiteOutline;

        return (
            <>
                {withDivider ? <Divider containerStyle={styles.divider} /> : null}
                <View style={styles.customBlock}>
                    <View style={styles.leftPart}>
                        <Text style={[ styles.statusWrapper, { fontWeight: '500' } ]}>
                            {shortcut?.title?.replace(name, '')}
                        </Text>
                        <Text style={styles.name} numberOfLines={1} variant='caption1'>
                            {name}
                        </Text>
                    </View>
                    <View style = {styles.rightPart}>
                        <AddToSiriButton
                            buttonStyle = {siriButtonStyle}
                            onPress     = {this.handleAddShortcut(shortcut?.shortcutOption)}
                            shortcut    = {shortcut?.shortcutOption}
                        />
                    </View>
                </View>
            </>
        );
    }

    renderPhone = () => {
        const { phone, colorMode, t, onOpenCallMenu } = this.props;
        const styles = style(colorMode);

        if (!phone) return null;

        return (
            <BorderedBlock style={styles.borderedBlock} variant='secondary'>
                <View style={styles.customBlock}>
                    <TouchableOpacity style={styles.leftPart} onPress={this.handleCopyPhone}>
                        <Text style={[ styles.statusWrapper ]} variant='caption1'>
                            {t('Call to device')}
                        </Text>
                        <View style={styles.phoneWrapper}>
                            <Text style={[ styles.name, { marginRight: 15, fontWeight: '500' } ]} numberOfLines={1}>
                                {phone}
                            </Text>
                            <CopyButton
                                size           = {15}
                                value          = {phone}
                                color          = {colors[colorMode].TEXT_SECONDARY}
                                forwardRef     = {this.copyButtonRef}
                                successMessage = {t('Phone number has been copied')}
                                ignoreClick
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rightPart} onPress={onOpenCallMenu}>
                        <Icon
                            type  = 'call'
                            color = {colors[colorMode].PRIMARY}
                            size  = {33}
                        />
                    </TouchableOpacity>
                </View>
            </BorderedBlock>
        );
    }

    render() {
        const {
            colorMode, onDismiss, isVisible, t,
            name, shortcuts
        } = this.props;
        const styles = style(colorMode);

        return (
            <Modal
                height        = {this.getModalHeight()}
                header        = {name}
                visible       = {isVisible}
                colorMode     = {colorMode}
                onDismiss     = {onDismiss}
                isCenteredTitle = {false}
                withKeyboard
                withCloseIcon
            >
                <View style={styles.contentContainer}>
                    { shortcuts?.length
                        ? (
                            <BorderedBlock style={styles.borderedBlock} variant='secondary'>
                                <Text style={styles.blockTitle} variant='caption1'>
                                    {t('Add Siri commands')}
                                </Text>
                                { shortcuts?.map(this.renderSiriShortcut) }
                            </BorderedBlock>
                        ) : null
                    }
                    { this.renderPhone() }
                </View>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(SettingsModal));
