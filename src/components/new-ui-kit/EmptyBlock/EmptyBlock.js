import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';
import { ScrollView }               from 'react-native-gesture-handler';

import { wh,
    allowFontScaling as platformAllowFontScaling
}                                   from '../../../utils/platform';
import Text                         from '../../ui-kit/Text';
import Icon                         from '../../ui-kit/Icon';

import style                        from './EmptyBlockStyles';


class EmptyBlock extends PureComponent {
    static propTypes = {
        colorMode        : PropTypes.string.isRequired,
        title            : PropTypes.string.isRequired,
        subtitle         : PropTypes.string,
        refreshControl   : PropTypes.node,
        allowFontScaling : PropTypes.bool
    }
    static defaultProps = {
        subtitle         : '',
        refreshControl   : void 0,
        allowFontScaling : void 0
    }

    render() {
        const {
            colorMode, allowFontScaling,
            title, subtitle, refreshControl
        } = this.props;
        const styles = style(colorMode);

        return (
            <ScrollView
                style                 = {styles.scroll}
                contentContainerStyle = {styles.container}
                refreshControl        = {refreshControl}
            >
                <Icon
                    type   = {`emptyDevice${colorMode}`}
                    style  = {styles.emptyIcon}
                    height = {wh * 0.2}
                    color  = 'transparent'
                />
                <View style = {styles.emptyTextContainer}>
                    <Text style = {styles.emptyTitle} allowFontScaling={allowFontScaling}>
                        { title }
                    </Text>
                    { subtitle
                        ? (
                            <Text style = {styles.emptySubtitle} allowFontScaling={allowFontScaling}>
                                { subtitle }
                            </Text>
                        ) : null
                    }
                </View>
            </ScrollView>
        );
    }
}

export default connect(
    state => ({
        colorMode        : state.theme.mode,
        allowFontScaling : platformAllowFontScaling
    })
)(withTranslation()(EmptyBlock));
