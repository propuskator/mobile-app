import React                            from 'react';
import PropTypes                        from 'prop-types';
import {
    View
}                                       from 'react-native';

import DefaultDeviceIcon                from '../../../new-assets/icons/tree.svg';
import colors                           from '../../../new-assets/constants/colors';

import SvgUriIcon                       from '../../ui-kit/SvgUriIcon';

import style                            from './DeviceIconStyles';


function DeviceIcon({ icon, colorMode } = {}) {
    const styles = style(colorMode);

    return (
        <View style={styles.defaultIcon} pointerEvents='none'>
            { icon
                ? (
                    <SvgUriIcon
                        key       = {icon}
                        uri       = {icon}
                        colorMode = {colorMode}
                        width     = {40}
                        height    = {40}
                    />
                ) : (
                    <DefaultDeviceIcon
                        fill   = {colors[colorMode].PRIMARY}
                        width  = '100%'
                        height = '100%'
                    />
                )
            }
        </View>
    );
}

DeviceIcon.propTypes = {
    icon      : PropTypes.string,
    colorMode : PropTypes.string.isRequired
};

DeviceIcon.defaultProps = {
    icon : void 0
};

export default DeviceIcon;
