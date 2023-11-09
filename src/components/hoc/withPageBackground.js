import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import LinearGradient               from 'react-native-linear-gradient';
import { connect }                  from 'react-redux';
import colors                       from '../../new-assets/constants/colors';

class withPageBackground extends PureComponent {
    static propTypes = {
        children           : PropTypes.object.isRequired,
        isThemeInitialized : PropTypes.bool.isRequired,
        colorMode          : PropTypes.string.isRequired
    };

    render() {
        const { children, isThemeInitialized, colorMode } = this.props;
        const { GRADIENT_START, GRADIENT_END } = colors[colorMode];
        const locations = colorMode === 'dark' ? [ 0, 1 ] : void 0;

        if (!isThemeInitialized) return null;

        return (
            <LinearGradient
                colors    = {[ GRADIENT_START, GRADIENT_END ]}
                style     = {{ flex: 1 }}
                locations = {locations}
            >
                { children }
            </LinearGradient>
        );
    }
}

export default connect(
    state => ({
        colorMode          : state.theme.mode,
        isThemeInitialized : state.theme.isInitialized,
        isSendBoxEnabled   : state.session.isSendBoxEnabled
    })
)(withPageBackground);
