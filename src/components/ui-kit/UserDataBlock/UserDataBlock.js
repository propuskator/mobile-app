import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    View,
    TouchableOpacity,
    ActivityIndicator
}                               from 'react-native';
import { Image }                from 'react-native-elements';


import Text                     from '../../ui-kit/Text';
import DefaultAvatar            from '../../../assets/static_icons/default_avatar.svg';

import style                    from './UserDataBlockStyles';

class UserDataBlock extends PureComponent {
    static propTypes = {
        workspace     : PropTypes.string.isRequired,
        email         : PropTypes.string.isRequired,
        serverUrl     : PropTypes.string.isRequired,
        avatarUrl     : PropTypes.string,
        onItemPress   : PropTypes.func,
        isUserChacked : PropTypes.bool.isRequired,
        colorMode     : PropTypes.string.isRequired,
        icon          : PropTypes.string.isRequired,
        onLongPress   : PropTypes.func
    }

    static defaultProps = {
        avatarUrl   : '',
        onLongPress : void 0,
        onItemPress : void 0
    }

    renderFallback = () => {
        return (
            <DefaultAvatar />
        );
    }


    handleItemPress = () => {
        const {  onItemPress, isUserChacked } = this.props;

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
            isUserChacked,
            onLongPress
        } = this.props;
        const defaultButtonHitslop = { top: 10, right: 5, bottom: 10, left: 5 };
        const styles = style(colorMode);

        return (
            <TouchableOpacity
                activeOpacity={onItemPress ? 0.2 : 1}
                onLongPress={onLongPress}
                onPress={this.handleItemPress}
                hitSlop={defaultButtonHitslop}
            >
                <View
                    style={[ styles.containerStyles,
                        isUserChacked && {
                            shadowOffset : {
                                width  : 2,
                                height : 1
                            },
                            shadowOpacity : 0.2
                        } ]}>
                    {
                        avatarUrl
                            ? <Image
                                source={{ uri: `${serverUrl}/${avatarUrl}` }}
                                style={styles.avatar}
                                transition={false}
                                placeholderStyle={styles.imagePlaceholderStyles}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                            : this.renderFallback()
                    }


                    <View  style={styles.dataContainer}>
                        <Text style = {styles.bold} >
                            {workspace}
                        </Text>

                        <Text
                            style         = {styles.text}
                            numberOfLines = {1}
                        >
                            <Text style = {styles.bolder}>Email: </Text>
                            {email}
                        </Text>

                        <Text
                            style         = {styles.text}
                            numberOfLines = {1}
                        >
                            <Text style = {styles.bolder}>URL: </Text>
                            {serverUrl}
                        </Text>
                    </View>
                    {icon}
                </View>
            </TouchableOpacity>
        );
    }
}

export default UserDataBlock;
