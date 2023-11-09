import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View,
    ActivityIndicator
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';

import colors                       from '../../../assets/constants/colors';
import Text                         from '../Text';

import style                        from './LoadingBlockStyles';


class LoadingBlock extends PureComponent {
    static propTypes = {
        colorMode   : PropTypes.string.isRequired,
        t           : PropTypes.func.isRequired,
        withOverlay : PropTypes.bool
    }

    static defaultProps={
        withOverlay : false
    }

    render() {
        const { colorMode, withOverlay, t } = this.props;
        const styles = style(colorMode);

        return (
            <View
                style={[
                    styles.container,
                    withOverlay && styles.overlay
                ]}>
                <View>
                    <ActivityIndicator size='large' color={colors[colorMode].PRIMARY} />
                    <Text style={styles.loadingText}>
                        {t('Updating...')}
                    </Text>
                </View>
            </View>

        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(withTranslation()(LoadingBlock));
