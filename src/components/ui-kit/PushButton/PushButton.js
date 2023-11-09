import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import { withTranslation }      from 'react-i18next';
import * as accessPoints        from '../../../actions/accessPoints';
import colors                   from '../../../assets/constants/colors';
import Icon                     from '../../ui-kit/Icon';
import Button                   from '../../ui-kit/Button';

import styles                   from './PushButtonStyles';

class PushButton extends PureComponent {
    static propTypes = {
        isEditable         : PropTypes.bool,
        containerStyle     : PropTypes.obj,
        isProcessing       : PropTypes.bool.isRequired,
        triggerAccessPoint : PropTypes.func.isRequired,
        value              : PropTypes.bool.isRequired,
        t                  : PropTypes.func.isRequired,
        topic              : PropTypes.string.isRequired,
        colorMode          : PropTypes.string.isRequired,
        size               : PropTypes.oneOf([ 'small', 'big' ]),
        style              : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        titleProps         : PropTypes.shape({ })
    }

    static defaultProps = {
        isEditable     : true,
        containerStyle : {},
        size           : 'small',
        style          : undefined,
        titleProps     : {}
    }

    state = {
        isProcessingBeforeConnect : null
    }


    componentDidUpdate(prevProps) {
        const { isProcessingBeforeConnect } = this.state;
        const { topic, triggerAccessPoint } = this.props;
        const isButtonWasPressedBeforeConnect = prevProps.topic !== this.props.topic
            && topic && isProcessingBeforeConnect;

        if (isButtonWasPressedBeforeConnect) {
            triggerAccessPoint({  topic, value: true });
            this.setState({
                isProcessingBeforeConnect : false
            });
        }
    }

    containerStyle = () => {
        const { isEditable } = this.props;

        return [
            styles.container,
            this.props.style,
            ...(isEditable ? [  ] : [ { opacity: 0.5, pointerEvents: 'none' } ])
        ];
    }

    handleTriggerAccess = async () => {
        const {  triggerAccessPoint, topic } = this.props;
        const nextValue = !this.getValueChecked();

        if (!topic) {
            this.setState({
                isProcessingBeforeConnect : true
            });
        } else {
            await triggerAccessPoint({  topic, value: nextValue });
        }
    }

    handleStopPropagation = e => e.stopPropagation()

    getValueChecked = () => {
        const { value } = this.props;

        return typeof value === 'boolean' ? value : value === 'true';
    }

    getButtonTitleIcon=() => {
        const { t } = this.props;
        const value = this.getValueChecked();


        return value === 'true' || value
            ?  {
                title : t('Close'),
                icon  : 'lock-open'

            }
            : {
                title : t('Open'),
                icon  : 'lock'
            };
    }

    getBackgroundColor = () => {
        const { colorMode } = this.props;
        const value = this.getValueChecked();
        const color = value
            ? colors[colorMode].DISABLED_BUTTON
            : colors[colorMode].ENABLED_BUTTON;

        return color;
    }

    render() {
        const {
            isEditable, containerStyle, size, isProcessing,
            colorMode, titleProps
        } = this.props;
        const { isProcessingBeforeConnect } = this.state;
        const { title, icon } = this.getButtonTitleIcon();
        const isDisabled = !isEditable || isProcessing || this.state.isProcessing;
        const backgroundColor = this.getBackgroundColor();


        return (
            <Button
                title          = {title}
                buttonStyle    = {{ ...styles.btn,  ...styles[size], backgroundColor }}
                containerStyle = {containerStyle}
                titleStyle     = {styles.btnTitle}
                onPress        = {this.handleTriggerAccess}
                loading        = {isProcessing || isProcessingBeforeConnect}
                disabled       = {isDisabled}
                titleProps     = {titleProps}
                iconRight
                icon={
                    <Icon
                        color = {
                            isDisabled
                                ? colors[colorMode].TEXT_SECONDARY
                                : colors[colorMode].TEXT_CONTRAST
                        }
                        size  = {22}
                        name  = {icon}
                    />
                }
            />

        );
    }
}

export default connect(
    state => ({
        processingList : state.accessPoints.processingList,
        colorMode      : state.theme.mode

    }), {
        ...accessPoints
    }
)(withTranslation()(PushButton));
