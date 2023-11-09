import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';
import { ScrollView }               from 'react-native-gesture-handler';

import colors                       from '../../../assets/constants/colors';
import Icons                        from '../../../assets/icons';
import { wh }                       from '../../../utils/platform';
import Text                         from '../../ui-kit/Text';

import style                        from './EmptyBlockStyles';

const EmptyIcon = Icons?.empty;


class EmptyBlock extends PureComponent {
    static propTypes = {
        colorMode      : PropTypes.string.isRequired,
        title          : PropTypes.string.isRequired,
        subtitle       : PropTypes.string,
        refreshControl : PropTypes.node
    }
    static defaultProps = {
        subtitle       : '',
        refreshControl : void 0
    }

    render() {
        const { colorMode, title, subtitle, refreshControl } = this.props;
        const styles = style(colorMode);

        return (
            <ScrollView
                style                 = {styles.scroll}
                contentContainerStyle = {styles.container}
                refreshControl        = {refreshControl}
            >
                <EmptyIcon
                    style  = {styles.emptyIcon}
                    height = {wh * 0.25}
                    fill   = {colors[colorMode].BACKGROUND}
                />
                <View style = {styles.emptyTextContainer}>
                    <Text style = {styles.emptyTitle}>
                        { title }
                    </Text>
                    { subtitle
                        ? (
                            <Text style = {styles.emptySubtitle}>
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
        colorMode : state.theme.mode
    })
)(withTranslation()(EmptyBlock));
