import React, { PureComponent }    from 'react';    // eslint-disable-line  no-unused-vars
import { connect }                 from 'react-redux';
import PropTypes                   from 'prop-types';

import smartHome                   from '../../../../smartHome';


class Relays extends PureComponent {
    static propTypes = {
        topics      : PropTypes.array.isRequired,
        renderRelay : PropTypes.func.isRequired
    };

    getRelayVersionFromTopic = (relayTopic) => {
        if (!relayTopic) return '';

        const topicParts = relayTopic?.split('/') || [];
        const lastPart = topicParts[topicParts?.length - 1];

        return lastPart?.replace(/\D/g, '');
    }

    getRelayName = ({ topic } = {}) => {
        if (!topic) return '';

        const relayVersion = this.getRelayVersionFromTopic(topic);

        return relayVersion ? `R${relayVersion}` : '-';
    }


    render() {
        const { topics, renderRelay } = this.props;
        const sorted = [ ...topics ]?.sort((a, b) => {
            const firstVersion = +this.getRelayVersionFromTopic(a?.topic);
            const secondVersion = +this.getRelayVersionFromTopic(b?.topic);

            return firstVersion - secondVersion;
        });

        return sorted?.map((topicData, index) => renderRelay({
            ...topicData,
            name    : this.getRelayName(topicData),
            isFirst : index === 1,
            isLast  : sorted?.length - 1 === index
        }));
    }
}

export default connect(
    (state, ownProps) => {
        const { topics = [] } = ownProps;
        const devices =  state?.homie?.devices || {};

        const topicsInstances = topics?.map(topic => {
            const { instance }  = smartHome?.getInstanceByTopic(topic) || {};
            const device = devices[instance?.device?.id] || {};
            const nodeEntity = device?.nodes?.find(node => node.id === 'r') || {};
            const sensorEntity = nodeEntity?.sensors?.find(sensor => sensor.id === instance?.id) || {};

            return {
                topic,
                instance,
                isProcessing : !!sensorEntity.isValueProcessing,
                value        : sensorEntity?.value || '',
                isEditable   : [ 'true', true ]?.includes(sensorEntity?.settable)
            };
        });

        return {
            topics    : topicsInstances,
            colorMode : state.theme.mode
        };
    },
    null
)(Relays);
