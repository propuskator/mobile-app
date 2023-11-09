import api          from '../apiSingleton';
import Storage      from '../utils/AsyncStorage';

import config       from '../config';


export function setAppUrls(apiUrl) {
    const brokerUrl = constructBrokerUrl(apiUrl);

    api.apiClient.setApiUrl(apiUrl);
    config.setVariable('API_URL', apiUrl);
    config.setVariable('BROKER_URL', brokerUrl);
    Storage.setItem('apiUrl', apiUrl);
}


export async function getApiUrl() {
    const apiUrl =  await Storage.getItem('apiUrl');

    console.log(apiUrl);

    return apiUrl || '';
}


export async function getBrokerUrl() {
    const brokerUrl =  await Storage.getItem('brokerUrl');

    return brokerUrl || '';
}

// eslint-disable-next-line func-style
const constructBrokerUrl = (url)  => {
    const isHttpsServer = url.search(/^(https)/) !== -1;
    const brokerProtokol = isHttpsServer ? 'wss' : 'ws';

    return url.replace(/^(https|http)/, brokerProtokol).concat('/mqtt-proxy');
};

