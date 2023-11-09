/* eslint-disable no-nested-ternary */
/* eslint-disable more/no-duplicated-chains */

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';

import colors                   from '../../new-assets/constants/colors';

export function withIconDefaultTheme(Component, isText = false) {
    class HOCComponent extends PureComponent {
        static propTypes = {
            colorMode : PropTypes.string.isRequired
        };


        render() {
            const { colorMode } = this.props;
            const color = isText
                ? colors[colorMode].TEXT_PRIMARY
                : colors[colorMode].BACKGROUND;

            return (
                <Component
                    fill={color}
                    {...this.props}
                />
            );
        }
    }

    return connect(
        state => ({
            colorMode : state.theme.mode
        })
    )(HOCComponent);
}
