import React                                 from 'react';
import {
    View,
    TouchableOpacity
}                                            from 'react-native';

import Icon                                  from '../../../ui-kit/Icon';

import screens                               from '../../../../new-assets/constants/screens';
import colors                                from '../../../../new-assets/constants/colors';

import style                                 from '../AuthNavigationStyles';


export default function groupViewOptions({ colorMode } = {}) {
    return ({ route, navigation }) => {
        const { id, title, itemData } = route.params;
        const styles = style(colorMode);

        return {
            title,
            headerTitleAllowFontScaling : false,
            headerRight                 : () => (
                <View style={styles?.screenOptionsRightContainer} >
                    <TouchableOpacity
                        style   = {styles?.rightHeaderBtn}
                        // eslint-disable-next-line react/jsx-no-bind
                        onPress = {() => {
                            navigation.navigate(screens.GROUP, {
                                id,
                                itemData
                            });
                        }}
                    >
                        <Icon
                            name    = 'pencil'
                            type    = 'simple-line-icon'
                            color   = {colors[colorMode].TEXT_SECONDARY}
                            size    = {20}
                        />
                    </TouchableOpacity>
                </View>
            )
        };
    };
}
