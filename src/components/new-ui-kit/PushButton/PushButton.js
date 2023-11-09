import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import { withTranslation }      from 'react-i18next';

import * as accessPoints        from '../../../actions/accessPoints';
import colors                   from '../../../new-assets/constants/colors';
import { isIOS }                from '../../../utils/platform';
import Button                   from '../../new-ui-kit/Button';

import styles                   from './PushButtonStyles';

class PushButton extends PureComponent {
    static propTypes = {
        isEditable         : PropTypes.bool,
        containerStyle     : PropTypes.obj,
        isProcessing       : PropTypes.bool.isRequired,
        isEditMode         : PropTypes.bool,
        triggerAccessPoint : PropTypes.func.isRequired,
        value              : PropTypes.bool.isRequired,
        t                  : PropTypes.func.isRequired,
        topic              : PropTypes.string.isRequired,
        colorMode          : PropTypes.string.isRequired,
        size               : PropTypes.oneOf([ 'small', 'big' ]),
        style              : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        buttonStyle        : PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.number ]),
        titleProps         : PropTypes.shape({ })
    }

    static defaultProps = {
        isEditable     : true,
        isEditMode     : false,
        containerStyle : {},
        size           : 'big',
        style          : undefined,
        buttonStyle    : void 0,
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

        return [ true, 'true' ]?.includes(value);
    }

    getButtonTitleIcon=() => {
        const { t } = this.props;
        const value = this.getValueChecked();

        return value
            ?  { title: t('Close'), icon: 'lock-open' }
            : { title: t('Open'), icon: 'lock' };
    }

    getBackgroundColor = () => {
        const { colorMode } = this.props;
        const value = this.getValueChecked();
        const color = value
            ? colors[colorMode].DISABLED_PUSH_BUTTON
            : colors[colorMode].ENABLED_PUSH_BUTTON;

        return color;
    }

    getTitleColor = () => {
        const { colorMode } = this.props;
        const value = this.getValueChecked();
        const color = value
            ? colors[colorMode].ERROR
            : colors[colorMode].PRIMARY_LABEL;

        return color;
    }

    render() {
        const {
            isEditable, containerStyle,
            size, isProcessing,
            titleProps, buttonStyle, isEditMode
        } = this.props;
        const { isProcessingBeforeConnect } = this.state;
        const { title } = this.getButtonTitleIcon();
        const isDisabled = !isEditable || isProcessing || this.state.isProcessing;
        const backgroundColor = this.getBackgroundColor();
        const titleStyle = { ...styles.btnTitle, color: this.getTitleColor() };
        const buttonFullStyle = { ...styles.btn,  ...styles[size], backgroundColor, buttonStyle };

        return (
            <Button
                title              = {title}
                buttonStyle        = {buttonFullStyle}
                containerStyle     = {containerStyle}
                titleStyle         = {titleStyle}
                disabledStyle      = {isEditMode && isEditable && isIOS ? buttonFullStyle : void 0}
                disabledTitleStyle = {isEditMode && isEditable && isIOS ? titleStyle : void 0}
                onPress            = {this.handleTriggerAccess}
                loading            = {isProcessing || isProcessingBeforeConnect}
                isDisabled         = {isEditMode || isDisabled}
                titleProps         = {titleProps}
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
