import React                            from 'react';

import NoConnect                        from '../new-ui-kit/NoConnection';

export function withNoConnectionMessage(Component) {
    return class extends React.Component {
        render() {
            return (
                <>
                    <Component {...this.props} />
                    <NoConnect />
                </>
            );
        }
    };
}
