import React, { Component }                  from 'react';
import PropTypes                             from 'prop-types';
import {
    View,
    Pressable
}                                            from 'react-native';

import Text                                  from '../../ui-kit/Text';
import Checkbox                              from '../../new-ui-kit/Checkbox';

import toast                                 from '../../../utils/Toast';
// import colors                                from '../../../assets/constants/colors';

import style                                 from './AccessPointSelectStyles.js';

export default class AccessPointSelect extends Component {
    static propTypes = {
        id             : PropTypes.string.isRequired,
        name           : PropTypes.string.isRequired,
        colorMode      : PropTypes.string.isRequired,
        isSelected     : PropTypes.bool,
        onToggleSelect : PropTypes.func.isRequired
    };

    static defaultProps = {
        isSelected : false
    }

    handleShowName = () => {
        const { name } = this.props;

        toast.show(name, 2);
    }

    handleClickCheckbox = () => {
        const { isSelected, onToggleSelect, id } = this.props;

        if (onToggleSelect) onToggleSelect({ name: id, value: !isSelected });
    }

    render() {
        const {
            name,
            colorMode,
            isSelected
        } = this.props;

        const styles = style(colorMode);

        return (
            <Pressable
                onLongPress   = {this.handleShowName}
                style         = {styles.container}
            >
                <View
                    style         = {{
                        ...styles.nameWrapper
                    }}
                >
                    <Text
                        numberOfLines = {1}
                        style         = {styles.name}
                    >
                        {name}
                    </Text>
                </View>

                <Checkbox
                    value          = {isSelected}
                    containerStyle = {styles.checkboxWrapper}
                    onValueChange  = {this.handleClickCheckbox}
                    colorMode      = {colorMode}
                    color          = 'green'
                />
            </Pressable>
        );
    }
}

