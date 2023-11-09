import React, { PureComponent }    from 'react';
import { View, Text }              from 'react-native';
import { connect }                 from 'react-redux';
import PropTypes                   from 'prop-types';

import smartHome                   from '../../../../smartHome';

import Icons                       from '../../../../assets/icons';

import style, { CONTAINER_COLORS } from './TopicStatesStyles';

class TopicStates extends PureComponent {
    static propTypes = {
        topics         : PropTypes.array.isRequired,
        colorMode      : PropTypes.string.isRequired,
        isExistInHomie : PropTypes.bool.isRequired
    };

    renderDisplayedTopicItem = (topic, index) => {
        const { topics, colorMode, isExistInHomie } = this.props;
        const title = topic?.name || `K${index + 1}`;
        const topicValue = topic?.value === 'true';
        // eslint-disable-next-line no-nested-ternary
        const LockIcon = !isExistInHomie
            ? Icons.lockDisabled
            : topicValue
                ? Icons.lockOpened
                : Icons.lockClosed;
        const isRenderDivider = index < topics.length - 1;

        const styles = style(colorMode);

        return (
            <>
                <View style={styles.lockIconContainer}>
                    <LockIcon fill={CONTAINER_COLORS[colorMode]} />
                    <Text style={styles.lockIconText}>{title}</Text>
                </View>

                {isRenderDivider && <View style={styles.divider} />}
            </>
        );
    }

    renderDisplayedTopics = () => {
        const { topics, colorMode } = this.props;
        const isVisible = !!topics.length;

        const styles = style(colorMode);

        return (
            <View
                style={{
                    ...styles.lockIcons,
                    opacity : isVisible ? 1 : 0
                }}
            >
                {!!topics.length && topics.map(this.renderDisplayedTopicItem)}
            </View>
        );
    }

    render() {
        return (
            <>{this.renderDisplayedTopics()}</>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const { topics = [] } = ownProps;
        const filtered = topics?.filter(t => !t?.includes('/r/'));

        const topicsInstances = filtered?.map(topic => {
            const { instance }  = smartHome?.getInstanceByTopic(topic) || {};

            return instance;
        }).sort((a, b) => a?.name > b?.name ? 1 : -1);

        return {
            topics    : topicsInstances,
            colorMode : state.theme.mode
        };
    },
    null
)(TopicStates);
