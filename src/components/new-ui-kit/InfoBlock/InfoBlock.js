import React, {
    PureComponent
}                                  from 'react';
import PropTypes                   from 'prop-types';
import {
    View
}                                  from 'react-native';

import colors                      from '../../../new-assets/constants/colors';

import Text                        from '../../new-ui-kit/Text';
import Icon                        from '../../new-ui-kit/Icon';

import style                       from './InfoBlockStyles';


class InfoBlock extends PureComponent {
    static propTypes = {
        colorMode : PropTypes.string.isRequired,
        t         : PropTypes.func.isRequired,
        tipKey    : PropTypes.string.isRequired
    };

    static defaultProps = {
    };

    render() {
        const { colorMode, t, tipKey } = this.props;
        const styles = style(colorMode);
        const text = t(tipKey);

        return (
            <View style={styles.container}>
                <View style={styles.iconWrapper}>
                    <Icon
                        type = 'infoCircle'
                        size = {21}
                        color = {colors[colorMode].TEXT_PRIMARY}
                    />
                </View>
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        );
    }
}

export default InfoBlock;
