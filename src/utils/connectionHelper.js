import { Alert } from 'react-native';
import {
    ERROR_TITLE,
    NETWORK_ERROR,
    INVALID_RESPONSE_ERROR

} from './validation/errors';


export function showNoConnectErrorAlert() {
    Alert.alert(
        ERROR_TITLE(),
        NETWORK_ERROR()
    );
}

export function withNoConnectErrorRequest(error, onError = null) {
    const isNetworkError =  !error.status
    && error.name === 'TypeError'
    && error.message === 'Network request failed';

    if (isNetworkError) {
        showNoConnectErrorAlert();
    } else if (onError) onError(error);
}


export function withAbbortedErrorRequest(error) {
    const isRequestAbborted = error.name === 'AbortError';


    if (isRequestAbborted) {
        Alert.alert(
            ERROR_TITLE(),
            INVALID_RESPONSE_ERROR()
        );
    }
}

