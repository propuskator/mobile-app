import React, { PureComponent }    from 'react';
// import PropTypes                   from 'prop-types';
import { Icon }                    from 'react-native-elements';

class CustomIcon extends PureComponent {
    static propTypes = {
    }

    render() {
        return (
            <Icon
                {...this.props}
            />
        );
    }
}

export default CustomIcon;
