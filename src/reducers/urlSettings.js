// import produce from 'immer';
// import config  from '../config';

// import {
//     CHANGE_URL_SETTINGS
// } from '../actions/urlSettings';

// const initialState = {
//     apiUrl    : config.API_URL,
//     brokerUrl : config.BROKER_URL
// };

// export default produce((draft, action) => {
//     const { type, payload } = action;

//     switch (type) {
//         case CHANGE_URL_SETTINGS: {
//             draft.apiUrl = payload.apiUrl;
//             draft.brokerUrl = payload.brokerUrl;
//             break;
//         }
//         default:
//             break;
//     }
// }, initialState);
