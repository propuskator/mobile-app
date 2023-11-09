import React                                 from 'react';
import {
    View,
    Alert,
    TouchableOpacity
}                                            from 'react-native';

import Icon                                  from '../../../new-ui-kit/Icon';
import colors                                from '../../../../new-assets/constants/colors';

import style                                 from '../AuthNavigationStyles';


export default function groupOptions({ colorMode, t, deleteGroup, deletingGroups = [] } = {}) {
    return ({ route, navigation }) => {
        const { id, title } = route.params || {};
        const styles = style(colorMode);
        const headerRight = id && !deletingGroups?.includes(id)
            ? (() => (  // eslint-disable-line   no-extra-parens
                <View style={styles.screenOptionsRightContainer} >
                    <TouchableOpacity
                        style   = {styles.rightHeaderBtn}
                        // eslint-disable-next-line react/jsx-no-bind
                        onPress = {() => {
                            Alert.alert(
                                t('Delete group'),
                                t('Are you sure you want to delete group?'),
                                [
                                    {
                                        text    : t('Yes, delete'),
                                        onPress : async () => {
                                            await deleteGroup({ id });

                                            navigation.goBack();
                                        },
                                        style : 'destructive'
                                    },
                                    {
                                        text : t('Cancel')
                                    }
                                ],
                                { cancelable: true }
                            );
                        }}
                    >
                        <Icon
                            type    = 'trash'
                            color   = {colors[colorMode].ERROR}
                            size    = {20}
                        />
                    </TouchableOpacity>
                </View>)
            ) : void 0;

        return {
            title                       : title || t(id ? 'Group editing' : 'Group creation'),
            headerTitleAllowFontScaling : false,
            headerRight
        };
    };
}
