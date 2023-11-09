import React, { PureComponent }             from 'react';
import { connect }                          from 'react-redux';
import PropTypes                            from 'prop-types';
import {
    ScrollView
}                                           from 'react-native';
import { withTranslation }                  from 'react-i18next';

// import screens                              from '../../../../new-assets/constants/screens';
import * as readerGroupsActions             from '../../../../actions/readerGroups';

import GroupTag                             from '../../../new-ui-kit/GroupTag';

import style                                from './GroupsListStyles';


class GroupsList extends PureComponent {
    static propTypes = {
        groups : PropTypes.arrayOf(PropTypes.shape({
        })),
        t               : PropTypes.func.isRequired,
        colorMode       : PropTypes.string.isRequired,
        // navigation      : PropTypes.object.isRequired,
        getReaderGroups : PropTypes.func.isRequired,
        isFetching      : PropTypes.bool.isRequired,
        onSelectGroup   : PropTypes.func.isRequired,
        selectedGroup   : PropTypes.any,
        forwardRef      : PropTypes.shape({}),
        onPress         : PropTypes.func.isRequired,
        deletingGroups  : PropTypes.array.isRequired
    }

    static defaultProps = {
        groups        : void 0,
        selectedGroup : void 0,
        forwardRef    : void 0
    }

    componentDidMount() {
        this.props.getReaderGroups();
    }

    // handleAddGroup = () => {
    //     const { navigation } = this.props;

    //     navigation.navigate(screens.GROUP);
    // }

    setRef = (node) => {
        const { forwardRef } = this.props;

        if (forwardRef) forwardRef.current = node;  // eslint-disable-line react/prop-types
    }

    render() {
        const {
            groups, colorMode, t, isFetching,
            selectedGroup, onSelectGroup, deletingGroups,
            onPress
        } = this.props;
        const styles = style(colorMode);
        const isListFetching = isFetching && !groups?.length;

        return (
            <ScrollView
                style                 = {[ styles.scroll, groups?.length > 3 ? styles.withPadding : void 0 ]}
                contentContainerStyle = {styles.container}
                bounces               = {false}
                ref                   = {this.setRef}
                onPress               = {onPress}
                horizontal
            >
                <GroupTag
                    key         = {'all'}
                    colorMode   = {colorMode}
                    onClick     = {onSelectGroup('all')}
                    variant     = 'filled'
                    label       = {t('All')}
                    type        = 'all'
                    isLoading   = {isListFetching}
                    groupStyle  = {styles.group}
                    isSelected  = {selectedGroup === 'all'}
                />
                { groups?.map(group => {
                    const { id, name, logoPath, logoColor } = group || {};
                    const isDeleting = deletingGroups?.includes(id);

                    return (
                        <GroupTag
                            key         = {id}
                            colorMode   = {colorMode}
                            variant     = 'filled'
                            isLoading   = {isDeleting}
                            onClick     = {isDeleting ? void 0 : onSelectGroup(id)}
                            // onClick     = {this.handleViewGroup(group)}
                            label       = {name || 'Default Name'}
                            logoPath    = {logoPath}
                            groupStyle  = {styles.group}
                            color       = {logoColor}
                            isSelected  = {selectedGroup === id}
                            withNameToast
                        />
                    );
                }) }
                {/*
                <GroupTag
                    key         = {'add'}
                    colorMode   = {colorMode}
                    type        = {'add'}
                    onClick     = {this.handleAddGroup}
                    variant     = {colorMode === 'light' ? 'outlined' : 'filled'}
                    label       = {t('Add')}
                    isLoading   = {isListFetching}
                    groupStyle  = {styles.group}
                />
                */}
            </ScrollView>
        );
    }
}

export default connect(
    state => ({
        colorMode           : state.theme.mode,
        isInternetReachable : state.connection.isInternetReachable,
        deletingGroups      : state?.readerGroups?.deletingGroups || []
        // isBrokerConecting   : isBrokerConectingSelector(state)
    }),
    {
        ...readerGroupsActions
    }
)(withTranslation()(GroupsList));
