import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { SvgCssUri }            from 'react-native-svg';
import { connect }              from 'react-redux';

import DefaultDeviceIcon        from '../../../new-assets/icons/tree.svg';

import colors                   from '../../../new-assets/constants/colors';

class SvgUriIcon extends PureComponent {
    static propTypes = {
        uri       : PropTypes.string.isRequired,
        colorMode : PropTypes.string.isRequired,
        width     : PropTypes.number.isRequired,
        height    : PropTypes.number.isRequired
    };

    static getDerivedStateFromError() {
        return { isSvgValid: false };
    }

    constructor(props) {
        super(props);

        this.state = {
            isSvgValid         : true,
            viewBox            : '',
            width              : this.props.width,
            height             : this.props.height,
            opacity            : 0,
            isNeedToSetViewBox : false
        };
    }

    componentDidCatch() {
        this.setState({ isSvgValid: false });
    }

    handleIconLayout = ({ nativeEvent }) => {
        const { opacity } = this.state;
        const { width, height } = this.props;
        const { width: initialWidth, height: initialHeight } = nativeEvent.layout;
        const viewBox = `0 0 ${initialWidth} ${initialHeight}`;
        const isNeedToSetViewBox = +initialWidth.toFixed(0) !== width && +initialHeight.toFixed(0) !== height;

        if (opacity === 1) {
            return;
        }

        this.setState({ viewBox, opacity: 1, isNeedToSetViewBox });
    }

    render() {
        const { isSvgValid, viewBox, width, height, opacity, isNeedToSetViewBox } = this.state;
        const { uri, colorMode } = this.props;

        if (!isSvgValid) {
            return (
                <DefaultDeviceIcon
                    fill   = {colors[colorMode].PRIMARY}
                    width  = {width}
                    height = {height}
                />
            );
        }

        return (
            <SvgCssUri
                onLayout = {this.handleIconLayout}
                style    = {{ opacity }}
                uri      = {uri}
                fill     = {colors[colorMode].BLACK_MAIN}
                {...isNeedToSetViewBox && { viewBox }}
                {...!!width && !!height && { width, height }}
            />
        );
    }
}

export default connect(
    state => ({
        colorMode : state.theme.mode
    })
)(SvgUriIcon);
