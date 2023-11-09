import React, { PureComponent } from 'react';
import { View }                 from 'react-native';
import PropTypes                from 'prop-types';
import PasswordStrengthChecker  from 'react-native-password-strength-checker';
import { withTranslation }      from 'react-i18next';

import config                   from '../../../config';
import { ww, isIOS }            from '../../../utils/platform';
import colors                   from '../../../new-assets/constants/colors';


import styles                   from './PasswordStrengthStyles';

class PasswordStrength extends PureComponent {
    static propTypes = {
        password       : PropTypes.string.isRequired,
        email          : PropTypes.string,
        onValueChange  : PropTypes.func,
        containerWidth : PropTypes.number,
        colorMode      : PropTypes.string.isRequired,
        t              : PropTypes.func.isRequired
    };

    static defaultProps = {
        email          : '',
        onValueChange  : () => {},
        containerWidth : ww
    };

    constructor(props) {
        super(props);

        this.notAllowedValues = [];
    }

    render() {
        const { password, email, onValueChange, containerWidth, colorMode, t } = this.props;
        const notAllowedValues = [
            email,
            config.DISPLAY_NAME.split(' ').join(''),
            config.DISPLAY_NAME.toLowerCase()
        ];
        const weakLabel = {
            label         : t('Weak'),
            labelColor    : '#fe6c6c',
            widthPercent  : '15',
            innerBarColor : '#fe6c6c'
        };
        const weakLabelSecond = {
            label         : t('Weak'),
            labelColor    : '#fe6c6c',
            widthPercent  : '35',
            innerBarColor : '#fe6c6c'
        };
        const fairLabel = {
            label         : t('Fair'),
            labelColor    : '#feb466',
            widthPercent  : '50',
            innerBarColor : '#feb466'
        };
        const fairLabelSecond = {
            label         : t('Fair'),
            labelColor    : '#feb466',
            widthPercent  : '75',
            innerBarColor : '#feb466'
        };
        const strongLabel = {
            label         : t('Strong'),
            labelColor    : '#6cfeb5',
            widthPercent  : '100',
            innerBarColor : '#6cfeb5'
        };


        return (
            <View style={styles.container}>
                <PasswordStrengthChecker
                    value            = {password}
                    email            = {email}
                    notAllowedValues = {notAllowedValues}
                    onValueChange    = {onValueChange}
                    containerWidth   = {containerWidth}
                    strengthLevels   = {[ weakLabel, weakLabelSecond, fairLabel, fairLabelSecond, strongLabel ]}
                    barWidthPercent  = {75}
                    strengthWrapperStyle = {{
                        position : 'absolute',
                        top      : 0,
                        left     : '-100%',
                        width    : '75%'
                    }}
                    strengthDescriptionStyle = {{
                        position : 'absolute',
                        top      : isIOS ? -6 : -8,
                        right    : 0,
                        width    : '25%',
                        fontSize : 15
                    }}
                    barColor = {colors[colorMode].GREY_LIGHT}
                />
            </View>
        );
    }
}

export default withTranslation()(PasswordStrength);
