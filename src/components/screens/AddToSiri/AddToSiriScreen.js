/* eslint-disable react/prop-types */
import React, { PureComponent }              from 'react';
import PropTypes                             from 'prop-types';
import { View }                              from 'react-native';
import { connect }                           from 'react-redux';

import AddToSiriButton, { SiriButtonStyles } from 'react-native-siri-shortcut/AddToSiriButton';
import { presentShortcut }                   from 'react-native-siri-shortcut';

// import screens                               from '../../../new-assets/constants/screens';

import Text                                  from '../../new-ui-kit/Text';
import style                                 from './AddToSiriScreenStyles';

class AddToSiri extends PureComponent {
    static propTypes = {
        route     : PropTypes.object.isRequired,
        colorMode : PropTypes.string.isRequired
        // navigation : PropTypes.object.isRequired
    }

    // componentDidMount() {
    //     const { navigation } = this.props;

    // navigation.addListener('beforeRemove', this.goBackListener);
    // }

    // componentWillUnmount() {
    // const {  navigation } = this.props;

    // navigation.removeListener('beforeRemove', this.goBackListener);
    // }

    // goBackListener = e => {
    //     const { route, navigation } = this.props;
    //     const previousScreen = route?.params?.previousScreen || screens.INSTRUCTIONS;

    //     if (previousScreen) {
    //         e.preventDefault();

    //         return navigation.navigate(previousScreen, {
    //             previousScreen : screens.ADD_TO_SIRI
    //         });
    //     }
    // }

    handleAddShortcut = (shortcut) => () => {
        presentShortcut(shortcut, () => {});
    }

    render() {
        const { colorMode } = this.props;
        const { shortcuts  } = this.props.route.params;
        const siriButtonStyle = colorMode === 'dark'
            ? SiriButtonStyles.blackOutline
            : SiriButtonStyles.whiteOutline;

        const styles = style(colorMode);

        return (
            <View style={styles.modal}>
                { shortcuts.map(({ title, key, shortcutOption }) => (
                    <View key={key} style={styles.block}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <AddToSiriButton
                            buttonStyle = {siriButtonStyle}
                            onPress     = {this.handleAddShortcut(shortcutOption)}
                            shortcut    = {shortcutOption}
                        />
                    </View>
                )) }
            </View>

        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(AddToSiri);
