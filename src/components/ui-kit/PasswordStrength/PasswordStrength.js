import React, { PureComponent } from 'react';
import { View }                 from 'react-native';
import { withTranslation }      from 'react-i18next';
import PropTypes                from 'prop-types';
import PasswordStrengthChecker  from 'react-native-password-strength-checker';
import config                   from '../../../config';

import styles                   from './PasswordStrengthStyles';

class PasswordStrength extends PureComponent {
    static propTypes = {
        password      : PropTypes.string.isRequired,
        email         : PropTypes.string,
        onValueChange : PropTypes.func,
        t             : PropTypes.func.isRequired
    };

    static defaultProps = {
        email         : '',
        onValueChange : () => {}
    };

    render() {
        const { password, email, onValueChange, t } = this.props;
        const notAllowedValues = [
            email,
            config.DISPLAY_NAME.split(' ').join(''),
            config.DISPLAY_NAME.toLowerCase()
        ];
        const weakLabel = {
            label         : t('Weak'),
            labelColor    : '#fe6c6c',
            widthPercent  : '33',
            innerBarColor : '#fe6c6c'
        };
        const fairLabel = {
            label         : t('Fair'),
            labelColor    : '#feb466',
            widthPercent  : '67',
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
                    strengthLevels   = {[ weakLabel, weakLabel, fairLabel, fairLabel, strongLabel ]}
                />
            </View>
        );
    }
}

export default withTranslation()(PasswordStrength);
