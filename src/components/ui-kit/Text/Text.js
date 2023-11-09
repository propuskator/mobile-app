import React, { PureComponent }    from 'react';
import { Text }                    from 'react-native-elements';

class CustomText extends PureComponent {
    static propTypes = {
    }

    render() {
        return (
            <Text
                {...this.props}
            />
        );
    }
}

export default CustomText;
