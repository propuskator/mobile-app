import React, { PureComponent }    from 'react';    // eslint-disable-line  no-unused-vars
import { connect }                 from 'react-redux';
import PropTypes                   from 'prop-types';

import smartHome                   from '../../../../smartHome';


class Topics extends PureComponent {
    static propTypes = {
        topics     : PropTypes.array.isRequired,
        renderItem : PropTypes.func.isRequired
    };

    render() {
        const { topics, renderItem } = this.props;
        const sorted = topics?.sort((a, b) => a?.title > b?.title ? 1 : -1) || [];

        return sorted?.map(renderItem);
    }
}

export default connect(
    (state, ownProps) => {
        const { topics = [] } = ownProps;
        const filtered = topics?.filter(t => !t?.includes('/r/'));
        const topicsInstances   = filtered?.map((topic, index) => {
            const { instance }  = smartHome?.getInstanceByTopic(topic) || {};
            const orderNumber = index + 1;
            // do not refactor next line -> LINT WILL CRASH
            const fallbackTitle = 'K' + orderNumber;    // eslint-disable-line

            return {
                topic,
                instance,
                title        : topic?.name || fallbackTitle,
                index,
                topicsAmount : filtered?.length
            };
        });

        return {
            topics    : topicsInstances,
            colorMode : state.theme.mode
        };
    },
    null
)(Topics);
