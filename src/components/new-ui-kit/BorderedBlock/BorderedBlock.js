import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import {
    View
}                                  from 'react-native';

import Text                        from '../../ui-kit/Text';

import { isAndroid }               from '../../../utils/platform';

import style                       from './BorderedBlockStyles';

class BorderedBlock extends PureComponent {
    static propTypes = {
        containerStyle : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        style : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        colorMode : PropTypes.string.isRequired,
        children  : PropTypes.any,
        title     : PropTypes.string,
        variant   : PropTypes.oneOf([
            'primary',
            'secondary'
        ]),
        withShadow : PropTypes.bool
    }

    static defaultProps = {
        containerStyle : void 0,
        style          : void 0,
        children       : null,
        title          : '',
        variant        : 'primary',
        withShadow     : false
    }

    render() {
        const {
            children, containerStyle, title,
            colorMode, variant, withShadow
        } = this.props;
        const styles = style(colorMode);

        return (
            <>
                { title
                    ? (
                        <Text
                            style   = {styles.title}
                            variant = {'headline4'}
                            color   = 'grey'
                        >
                            {title}
                        </Text>
                    ) : null
                }
                <View style={withShadow ? styles.withShadow : {}}>
                    <View
                        style={[
                            styles.container,
                            styles[variant],
                            withShadow && isAndroid ? styles.bordered : {},
                            containerStyle,
                            this.props.style
                        ]}>
                        { children }
                    </View>
                </View>

            </>
        );
    }
}

export default connect(
    state => ({
        colorMode        : state.theme.mode,
        isSendBoxEnabled : !!state?.session?.isSendBoxEnabled
    })
)(BorderedBlock);

