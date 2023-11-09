import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { Image }                from 'react-native';
import FastImage                from 'react-native-fast-image';

class CustomImage extends PureComponent {
    static propTypes = {
        withAspectRatio : PropTypes.bool,
        width           : PropTypes.number,
        source          : PropTypes.object,
        style           : PropTypes.object
    }

    static defaultProps = {
        withAspectRatio : false,
        width           : 300,
        source          : {},
        style           : {}
    }

    constructor(props) {
        super(props);

        this.state = {
            width  : 0,
            height : 0
        };
    }

    componentDidMount() {
        const { withAspectRatio } = this.props;

        if (withAspectRatio) {
            this.calculateAspectRatio();
        }
    }

    calculateAspectRatio = () => {
        const { width, source: { uri } } = this.props;

        Image.getSize(uri, (w, h) => {
            const aspectRatio = w / h;
            const height = Math.round(width / aspectRatio);

            this.setState({ width, height });
        });
    }

    renderImage = () => {
        const { width, height } = this.state;
        const { withAspectRatio, style } = this.props;

        if (withAspectRatio) {
            return (
                <FastImage
                    {...this.props}
                    width={width}
                    height={height}
                    style={{ ...style, width, height }}
                />
            );
        }

        return (
            <FastImage
                {...this.props}
            />
        );
    }

    render() {
        return this.renderImage();
    }
}

export default CustomImage;
