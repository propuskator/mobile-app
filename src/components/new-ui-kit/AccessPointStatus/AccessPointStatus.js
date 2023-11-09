import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import colors                   from '../../../new-assets/constants/colors';
import Text                     from '../../new-ui-kit/Text';

import statusStyle              from './AccessPointStatusStyles.js';

const STATUSSES_LIST = [ 'red', 'yellow', 'green' ];

class AccessPointStatus extends PureComponent {
    static propTypes ={
        state     : PropTypes.oneOf(STATUSSES_LIST).isRequired,
        style     : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        colorMode : PropTypes.string
    }

    static defaultProps={
        style     : undefined,
        colorMode : 'light'
    }

    checkIsStatusValid = () => !!STATUSSES_LIST?.includes(this.props.state);

    getStatusMeta = (state) => {
        const { colorMode } = this.props;
        const STATUS_META_BY_STATE = {
            red : {
                color : colors[colorMode].ERROR,
                label : 'Offline'
            },
            yellow : {
                color : colors[colorMode].ORANGE_MAIN,
                label : 'Init'
            },
            green : {
                color : colors[colorMode].SALAD,
                label : 'Online'
            }
        };

        return STATUS_META_BY_STATE[state] || STATUS_META_BY_STATE.red;
    }

    renderStatus = () => {
        const { state, style, colorMode } = this.props;
        const styles = statusStyle(colorMode);
        const { color, label } = this.getStatusMeta(state);

        return (
            <Text style={[ styles.status, { color }, style ]}>
                {label}
            </Text>
        );
    }

    render() {
        const isValid = this.checkIsStatusValid();

        if (!isValid) return null;

        return this.renderStatus();
    }
}


export default AccessPointStatus;
