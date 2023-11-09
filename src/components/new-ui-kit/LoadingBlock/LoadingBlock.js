import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View,
    ActivityIndicator
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';

import colors                       from '../../../new-assets/constants/colors';
import Text                         from '../Text';

import style                        from './LoadingBlockStyles';


class LoadingBlock extends PureComponent {
    static propTypes = {
        colorMode  : PropTypes.string.isRequired,
        t          : PropTypes.func.isRequired,
        withTitle  : PropTypes.bool,
        blockStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        loadingText : PropTypes.string
    }

    static defaultProps = {
        withTitle   : true,
        blockStyle  : void 0,
        loadingText : void 0
    }

    render() {
        const { colorMode, t, withTitle, blockStyle, loadingText } = this.props;
        const styles = style(colorMode);

        return (
            <View style={[ styles.container, blockStyle ]}>
                <View>
                    <ActivityIndicator size='large' color={colors[colorMode].PRIMARY} />
                    { withTitle
                        ? (
                            <Text style={styles.loadingText}>
                                {loadingText ? loadingText : t('Updating...')}
                            </Text>
                        ) : null
                    }
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
