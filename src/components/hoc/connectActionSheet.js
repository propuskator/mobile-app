import { connectActionSheet } from '@expo/react-native-action-sheet';
import React                    from 'react';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';

import { ActionSheetIOS }       from 'react-native';
import colors                   from '../../new-assets/constants/colors';

import { isIOS }                from '../../utils/platform';


export function withActionSheet(Component) {
    class WrappedCommponent extends React.Component {
        static propTypes = {
            colorMode                  : PropTypes.string.isRequired,
            showActionSheetWithOptions : PropTypes.func.isRequired
        };

        constructor(props) {
            super(props);
        }

        handleShowActionSheet=(options, ...rest) => {
            const { colorMode, showActionSheetWithOptions } = this.props;

            return isIOS
                ? ActionSheetIOS.showActionSheetWithOptions(
                    {
                        ...options,
                        userInterfaceStyle : colorMode
                    }, ...rest)
                : showActionSheetWithOptions(
                    {
                        ...options,
                        containerStyle : {
                            backgroundColor : colors[colorMode].BACKGROUND
                        },
                        textStyle : { color: colors[colorMode].TEXT_PRIMARY }
                    },
                    ...rest);
        }

        render() {
            return (
                <Component
                    {...this.props}
                    // eslint-disable-next-line react/jsx-handler-names
                    showActionSheetWithOptions={this.handleShowActionSheet}
                />
            );
        }
    }

    return  connect(
        (state) => {
            return {
                colorMode : state.theme.mode
            };
        })(connectActionSheet(WrappedCommponent));
}
