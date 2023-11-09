import {  Alert } from 'react-native';
import {
    TIMEOUT_ERROR_TITLE,
    TIMEOUT_ERROR,
    ERROR_TITLE,
    INVALID_RESPONSE_ERROR
}                 from './utils/validation/errors';
import config     from './config';

import apiFactory from './api';


function handleConnectError() {
    Alert.alert(
        ERROR_TITLE(),
        INVALID_RESPONSE_ERROR()
    );
}

function handleTimeoutError() {
    Alert.alert(
        TIMEOUT_ERROR_TITLE(),
        TIMEOUT_ERROR()
    );
}

const api = apiFactory({
    apiUrl            : config.API_URL,
    prefix            : config.API_PREFIX,
    onError           : error => console.log('Connection error: ', error),
    onNetworkError    : () => {},
    onConnectionError : handleConnectError,
    onTimeoutError    : handleTimeoutError
});

export default api;
