import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { withTranslation }          from 'react-i18next';
import { connect }                  from 'react-redux';
import { View }                     from 'react-native';

import colors                       from '../../../new-assets/constants/colors';
import Icon                         from '../../new-ui-kit/Icon';

import InfoModal                    from './InfoModal';
// import style                        from './InfoTipStyles';


class InfoTip extends PureComponent {
    static propTypes = {
        t              : PropTypes.func.isRequired,
        colorMode      : PropTypes.string.isRequired,
        containerStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        tipKey : PropTypes.string
    }

    static defaultProps = {
        containerStyle : void 0,
        tipKey         : 'workspaceTip'
    }

    state = {
        showInfoModal : false
    }

    handleCloseModal = () => {
        this.setState({ showInfoModal: false });
    }

    handleOpenModal = () => {
        this.setState({ showInfoModal: true });
    }

    render() {
        const { colorMode, t, containerStyle, tipKey } = this.props;
        const { showInfoModal } = this.state;
        // const styles = style(colorMode);
        const text = t(tipKey);

        return (
            <View style={[ containerStyle ]}>
                <Icon
                    type    = 'questionCircle'
                    color   = {colors[colorMode].PRIMARY}
                    onPress = {this.handleOpenModal}
                />
                <InfoModal
                    key         = {tipKey}
                    onDismiss   = {this.handleCloseModal}
                    isVisible   = {showInfoModal}
                    title       = {t('Workspace')}
                    description = {text}
                />
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(InfoTip));
