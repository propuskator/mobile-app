import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    View,
    ActivityIndicator,
    TouchableOpacity
}                               from 'react-native';
import { Image }                from 'react-native-elements';

import colors                   from '../../../new-assets/constants/colors';

import Text                     from '../../new-ui-kit/Text';
import Icon                     from '../../new-ui-kit/Icon';
import DefaultAvatar            from '../../../new-assets/icons/static_icons/default_avatar.svg';

import style                    from './UserDataBlockStyles';


class UserDataBlock extends PureComponent {
    static propTypes = {
        style : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        workspace     : PropTypes.string.isRequired,
        email         : PropTypes.string.isRequired,
        serverUrl     : PropTypes.string.isRequired,
        avatarUrl     : PropTypes.string,
        onItemPress   : PropTypes.func,
        onDeleteItem  : PropTypes.func,
        isUserChacked : PropTypes.bool.isRequired,
        colorMode     : PropTypes.string.isRequired,
        icon          : PropTypes.string.isRequired,
        onLongPress   : PropTypes.func
    }

    static defaultProps = {
        style        : void 0,
        avatarUrl    : '',
        onLongPress  : void 0,
        onItemPress  : void 0,
        onDeleteItem : void 0
    }

    renderFallback = () => {
        return (
            <DefaultAvatar />
        );
    }

    handleItemPress = () => {
        const { onItemPress, isUserChacked } = this.props;

        if (onItemPress && !isUserChacked) onItemPress();
    }

    render() {
        const {
            avatarUrl,
            workspace,
            email,
            serverUrl,
            colorMode,
            icon,
            onItemPress,
            onDeleteItem,
            // isUserChacked,
            onLongPress
        } = this.props;
        const defaultButtonHitslop = { top: 10, right: 5, bottom: 10, left: 5 };
        const styles = style(colorMode);

        return (
            <TouchableOpacity
                activeOpacity = {onItemPress ? 0.2 : 1}
                onLongPress   = {onLongPress}
                onPress       = {this.handleItemPress}
                hitSlop       = {defaultButtonHitslop}
                style         = {[ styles.container, this.props.style ]}
            >
                <View style={[ styles.containerStyles ]}>
                    <View style={styles.avatarWrapper}>
                        { avatarUrl
                            ? <Image
                                source             = {{ uri: `${serverUrl}/${avatarUrl}` }}
                                style              = {styles.avatar}
                                transition         = {false}
                                placeholderStyle   = {styles.imagePlaceholderStyles}
                                PlaceholderContent = {<ActivityIndicator />}
                            />
                            : this.renderFallback()
                        }
                        <View style={styles.iconWrapper}>
                            {icon}
                        </View>
                    </View>
                    <View  style={styles.dataContainer}>
                        <Text style = {styles.bold} >
                            {workspace}
                        </Text>

                        <Text
                            style         = {styles.text}
                            numberOfLines = {1}
                        >
                            <Text style = {[ styles.bolder, styles.text ]}>Email: </Text>
                            {email}
                        </Text>

                        <Text
                            style         = {styles.text}
                            numberOfLines = {1}
                        >
                            <Text style = {[ styles.bolder, styles.text ]}>URL: </Text>
                            {serverUrl}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onDeleteItem} style={styles.deleteIconWrapper}>
                        <Icon
                            type  = 'exit'
                            color = {colors[colorMode].TEXT_SECONDARY}
                            size  = {25}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}

export default UserDataBlock;
