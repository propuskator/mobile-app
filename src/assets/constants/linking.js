// import Config  from 'react-native-config';

import screens from './screens';

const config = {
    screens : {
        [screens.REGISTRATION]    : screens.REGISTRATION,
        [screens.REQUEST_REGISTR] : 'REQUEST',
        [screens.LOGIN]           : screens.LOGIN
    }
};

const LINKING = {
    prefixes : [
        'https://propuskator.too-smart-tech.com/app',
        'https://cloud.propuskator.com/app'
    ],
    config
};

export default LINKING;
