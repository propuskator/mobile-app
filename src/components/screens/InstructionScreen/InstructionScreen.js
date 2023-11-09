import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import {
    ActivityIndicator,
    ScrollView,
    View,
    Linking
}                                         from 'react-native';
import StyledText                         from 'react-native-styled-text';
import { withTranslation }                from 'react-i18next';
import { connect }                        from 'react-redux';

import colors                             from '../../../assets/constants/colors';
import Text                               from '../../ui-kit/Text';
import Image                              from '../../ui-kit/Image';

import { getInstructionStructure, LINKS } from './constants';
import style                              from './InstructionScreenStyles';

class InstructionScreen extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        route      : PropTypes.object.isRequired,
        t          : PropTypes.func.isRequired,
        colorMode  : PropTypes.string.isRequired,
        i18n       : PropTypes.object.isRequired
    };

    componentDidMount() {
        this.renderHeader();
    }

    handleLinkPress = key => {
        const link = LINKS[key];

        Linking.openURL(link);

        console.log(link);
    }

    renderHeader = () => {
        const { navigation, route, t, colorMode, i18n: { language } } = this.props;
        const { type } = route.params;
        const INSTRUCTION_STRUCTURE = getInstructionStructure(type, language);
        const HeaderIcon = INSTRUCTION_STRUCTURE.header.icon;
        const headerTitle = INSTRUCTION_STRUCTURE.header.title;

        const styles = style(colorMode);

        navigation.setOptions({
            headerTitleAlign : 'center',
            headerTitleStyle : {},
            headerTitle      : (
                <View style={styles.header}>
                    <HeaderIcon />
                    <Text style={styles.headerTitle}>{t(headerTitle)}</Text>
                </View>
            )
        });
    }

    renderListItem = (number, text) => {
        const { t, colorMode } = this.props;

        const styles = style(colorMode);

        return (
            <View key={text} style={styles.listItem}>
                <Text style={styles.listNumber}>{`${number}.`}</Text>

                <StyledText
                    style={styles.listText}
                    textEvents={{ a: { onPress: this.handleLinkPress } }}
                >
                    {t(text)}
                </StyledText>
            </View>
        );
    }

    renderImages = images => {
        const { colorMode } = this.props;

        const styles = style(colorMode);

        const width = 250;
        const height = 507;

        return images.map(el => {
            return (
                <View style={{ ...styles.imageWrapper, width, height }} key={el}>
                    <ActivityIndicator
                        size  = 'large'
                        color = {colorMode === 'light' ? colors[colorMode]?.GRAY : '#FFF'}
                    />
                    <Image
                        source     = {{ uri: el }}
                        resizeMode = 'contain'
                        style      = {{ ...styles.image, width, height }}
                        width      = {width}
                        height     = {height}
                    />
                </View>
            );
        });
    }

    renderInstruction = () => {
        const { route, t, colorMode, i18n: { language } } = this.props;
        const { type } = route.params;
        const INSTRUCTION_STRUCTURE = getInstructionStructure(type, language);
        const title = INSTRUCTION_STRUCTURE.title;
        const content = INSTRUCTION_STRUCTURE.content;

        const styles = style(colorMode);

        return (
            <>
                {title && (
                    <Text style={styles.title}>{t(title)}</Text>
                )}

                {Object.keys(content).map(el => {
                    return (
                        <Fragment key={el}>
                            {this.renderListItem(el, content[el].title)}
                            {this.renderImages(content[el].images)}
                        </Fragment>
                    );
                })}
            </>
        );
    }

    render() {
        const { colorMode } = this.props;

        const styles = style(colorMode);

        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {this.renderInstruction()}
            </ScrollView>
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    }),
    null
)(withTranslation()(InstructionScreen));
