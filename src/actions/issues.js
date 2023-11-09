import api from '../apiSingleton';
import { withNoConnectErrorRequest }  from '../utils/connectionHelper';

export function sendIssue({ payload, onSuccess, onError }) {
    return async () => {
        try {
            const res = await api.issues.send(payload);

            if (onSuccess) {
                onSuccess(res);
            }
        } catch (error) {
            console.log('Send issue error', error);
            withNoConnectErrorRequest(error);

            if (onError) {
                onError(error);
            }
        }
    };
}
