// import api          from '../apiSingleton';
// import Storage      from '../utils/AsyncStorage';

// import config       from '../config';

// export const CHANGE_URL_SETTINGS = 'CHANGE_URL_SETTINGS';

// function setAppUrls(apiUrl) {
//     return () => {
//         const brokerUrl = constructBrokerUrl(apiUrl);

//         api.apiClient.setApiUrl(apiUrl);
//         config.setVariable('API_URL', apiUrl);
//         config.setVariable('BROKER_URL', brokerUrl);
//     };
// }

// function changeApiUrl(apiUrl) {
//     api.apiClient.setApiUrl(apiUrl);
//     config.setVariable('API_URL', apiUrl);
// }


// export function updateApiUrl({ apiUrl }) {
//     return async (dispatch) => {
//         const brokerUrl = constructBrokerUrl(apiUrl);

//         await Storage.setItem('apiUrl', apiUrl);
//         await Storage.setItem('brokerUrl', brokerUrl);

//         changeApiUrl(apiUrl);

//         dispatch({
//             type    : CHANGE_URL_SETTINGS,
//             payload : {
//                 apiUrl,
//                 brokerUrl
//             }
//         });
//     };
// }

// export function setApiUrlFromStorage() {
//     return async (dispatch) => {
//         const apiUrl = await getApiUrl();
//         const brokerUrl = await getBrokerUrl() || constructBrokerUrl(apiUrl);

//         if (apiUrl) {
//             changeApiUrl(apiUrl);

//             dispatch({
//                 type    : CHANGE_URL_SETTINGS,
//                 payload : {
//                     apiUrl,
//                     brokerUrl
//                 }
//             });
//         }
//     };
// }

// export async function getApiUrl() {
//     const apiUrl =  await Storage.getItem('apiUrl');

//     return apiUrl || '';
// }


// export async function getBrokerUrl() {
//     const brokerUrl =  await Storage.getItem('brokerUrl');

//     return brokerUrl || '';
// }

// // eslint-disable-next-line func-style
// const constructBrokerUrl = (url)  => {
//     const isHttpsServer = url.search(/^(https)/) !== -1;
//     const brokerProtokol = isHttpsServer ? 'wss' : 'ws';

//     return url.replace(/^(https|http)/, brokerProtokol).concat('/mqtt-proxy');
// };

