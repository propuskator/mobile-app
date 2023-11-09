import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import {
    View
}                                   from 'react-native';
import { connect }                  from 'react-redux';
import { withTranslation }          from 'react-i18next';
import {
    ScrollView,
    TouchableOpacity
}                                   from 'react-native-gesture-handler';

import SuccessIcon                  from '../../../assets/static_icons/success.svg';
import colors                       from '../../../assets/constants/colors';
import Button                       from '../../new-ui-kit/Button';
import GroupTag                     from '../../ui-kit/GroupTag';
import LoadingBlock                 from '../../ui-kit/LoadingBlock';
import EmptyBlock                   from '../../ui-kit/EmptyBlock';
import Text                         from '../../ui-kit/Text';
import {
    getDefaultColor
}                                   from '../../screens/utils/groupLogo';

import style                        from './GroupLogoStyles';

const COLOR_OPTIONS = [ '#56BDB1', '#56B0F0', '#BD6AB8', '#BDBD4D', '#BD6260' ];
const DEFAULT_COLOR = getDefaultColor();

class GroupLogo extends PureComponent {
    static propTypes = {
        navigation : PropTypes.object.isRequired,
        t          : PropTypes.func.isRequired,
        colorMode  : PropTypes.string.isRequired,
        route      : PropTypes.shape({
            params : PropTypes.shape({
                logo : PropTypes.string
            }).isRequired
        }).isRequired,
        logosById       : PropTypes.shape({}),
        isLogosFetching : PropTypes.bool
    }

    static defaultProps = {
        logosById       : {},
        isLogosFetching : false
    }

    state = {
        logo      : this.props?.route?.params?.logo,
        logoColor : this.props?.route?.params?.logoColor || DEFAULT_COLOR,  // eslint-disable-line react/prop-types
        errors    : {}
    }

    handleLogoChange = (key, value) => {
        this.setState({
            [key]  : value,
            errors : {}
        });
    }

    handleCancel = () => {
        this.props.navigation.goBack(null);
    }

    handleSave = () => {
        const { logo, logoColor } = this.state;
        const { route } = this.props;
        const { onSave } = route?.params;

        // if (!logo) {
        //     return this.handleError({ logo: t('Logo is required') });
        // }
        if (onSave) onSave({ logo, logoColor });

        this.props.navigation.goBack(null);
    }


    handleError = errors => {
        this.setState({
            isLoading : false,
            errors
        });
    }

    handleSelectField = ({ name, value }) => () => {
        this.setState({
            [name] : value,
            errors : {
                ...this.state.errors,
                [name] : ''
            }
        });
    }

    renderSuccessIcon = () => {
        const { colorMode } = this.props;
        const styles = style(colorMode);

        return <SuccessIcon style={styles.selectedIcon} />;
    }

    render() {
        const { colorMode, logosById, isLogosFetching } = this.props;
        const { logo, logoColor, errors } = this.state;
        const { t } = this.props;

        const styles = style(colorMode);
        const logosKeys = Object.keys(logosById);
        const isEmpty = !isLogosFetching && !logosKeys?.length;

        const defaultColor = colors[colorMode].LOGO_DEFAULT_COLOR;

        return (
            <View
                style    = {styles.container}
            >
                <View  style = {styles.wrapper}>
                    <ScrollView
                        style                 = {styles.groupsContainer}
                        contentContainerStyle = {styles.groupsList}
                    >
                        { isLogosFetching && !logosKeys?.length
                            ? <LoadingBlock />
                            : null
                        }

                        { isEmpty
                            ? (
                                <EmptyBlock
                                    title          = {t('You have no available logos yet')}
                                    subtitle       = {t('Contact your administrator to get your logos')}
                                />
                            ) : null
                        }

                        { !isLogosFetching && logosKeys?.length
                            ? (
                                <>
                                    <Text
                                        style={[
                                            styles.title,
                                            errors?.logo ? styles.errorTitle : void 0
                                        ]}
                                    >
                                        {t('Select group logo')}
                                    </Text>
                                    <View style={styles.groupsWrapper}>
                                        { logosKeys?.map(logoKey => {
                                            return (    // eslint-disable-next-line react/jsx-key
                                                <View style={styles.groupWrapper}>
                                                    <GroupTag
                                                        key        = {logoKey}
                                                        colorMode  = {colorMode}
                                                        variant    = 'filled'
                                                        logoPath   = {logosById[logoKey]}
                                                        size       = {'M'}
                                                        onClick    = {this.handleSelectField({ name: 'logo', value: logoKey })}
                                                        isSelected = {logo === logoKey}
                                                        color      = {logoColor}
                                                    />
                                                </View>
                                            );
                                        }) }
                                    </View>
                                    <Text style={styles.title}>
                                        {t('Select logo color')}
                                    </Text>
                                    <View style={styles.colorOptions}>
                                        <TouchableOpacity
                                            key     = {DEFAULT_COLOR}
                                            style   = {styles.colorOptionWrapper}
                                            onPress = {this.handleSelectField({ name: 'logoColor', value: DEFAULT_COLOR })}
                                        >
                                            <View
                                                style = {[
                                                    styles.colorOption,
                                                    ...[ { backgroundColor: defaultColor } ]
                                                ]}
                                            />
                                            { logoColor === DEFAULT_COLOR
                                                ? this.renderSuccessIcon()
                                                : null
                                            }
                                        </TouchableOpacity>
                                        { COLOR_OPTIONS?.map(color => (
                                            <TouchableOpacity
                                                key     = {color}
                                                style   = {styles.colorOptionWrapper}
                                                onPress = {this.handleSelectField({ name: 'logoColor', value: color })}
                                            >
                                                <View
                                                    style = {[
                                                        styles.colorOption,
                                                        ...[ { backgroundColor: color } ]
                                                    ]}
                                                />
                                                { logoColor === color
                                                    ? this.renderSuccessIcon()
                                                    : null
                                                }
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            ) : null
                        }
                    </ScrollView>
                    { !isEmpty
                        ? (
                            <Button
                                containerStyle = {styles.button}
                                title          = {t('Select')}
                                onPress        = {this.handleSave}
                            />
                        ) : null
                    }
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        colorMode       : state.theme.mode,
        logosById       : state.readerGroups.logosById,
        isLogosFetching : state.readerGroups.isLogosFetching
    })
)(withTranslation()(GroupLogo));
