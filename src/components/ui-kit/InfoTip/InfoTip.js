import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { withTranslation }          from 'react-i18next';
import { connect }                  from 'react-redux';
import {  Tip }                     from 'react-native-tip';
import colors                       from '../../../assets/constants/colors';
import Icon                         from '../../ui-kit/Icon';

import style                        from './InfoTipStyles';

class InfoTip extends PureComponent {
    static propTypes = {
        t         : PropTypes.func.isRequired,
        colorMode : PropTypes.string.isRequired,
        id        : PropTypes.string.isRequired
    }

    static defaultProps = {

    }

    render() {
        const { colorMode, t, id } = this.props;
        const  text = t('workspaceTip');
        const styles = style(colorMode);

        return (
            <Tip
                id={id}
                body={text}
                showItemPulseAnimation
                bodyStyle={styles.tipText}
                tipContainerStyle={styles.tip}
                pulseColor='#ff8080'
            >
                <Icon
                    name  = 'questioncircleo'
                    type  = 'antdesign'
                    color = {colors[colorMode].PRIMARY}
                />
            </Tip>
        );
    }
}

export default connect(
    state => ({
        colorMode      : state.theme.mode,
        deepLinkUrl    : state.linking.deepLinkUrl,
        deepLinkParams : state.linking.deepLinkParams
    })
)(withTranslation()(InfoTip));
