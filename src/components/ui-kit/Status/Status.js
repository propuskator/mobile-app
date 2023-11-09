import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { View }                 from 'react-native';
import LIVR                     from 'livr';

import statusStyle              from './StatusStyles.js';

const possibleStatuses = [ 'red', 'yellow', 'green' ];

const statusValidator = new LIVR.Validator({
    status : [ 'required', { 'oneOf': possibleStatuses } ]
});


class Status extends PureComponent {
    static propTypes ={
        state     : PropTypes.oneOf(possibleStatuses).isRequired,
        style     : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        colorMode : PropTypes.string,
        size      : PropTypes.string
    }

    static defaultProps={
        style     : undefined,
        colorMode : 'light',
        size      : 'small'
    }

    validStatus() {
        const res = statusValidator.validate({ status: this.props.state });

        return !!res;
    }

    renderIndicator() {
        const { state, style, colorMode, size } = this.props;
        const styles = statusStyle(colorMode);
        const indicatorStyles   = [ styles.indicator,  styles[state], styles[size] ];
        const stateStyles = [ styles.state, style ];

        return (
            <View style = {stateStyles} >
                <View  style = {indicatorStyles} />
            </View>
        );
    }

    render() {
        return (
            this.validStatus
                ? this.renderIndicator()
                : null
        );
    }
}


export default Status;
