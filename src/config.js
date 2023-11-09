import Config from 'react-native-config';

function configConstruct({ config }) {
    const myConfig = {
        ...(config || {})
    };

    function setVariable(key, value) {
        const AVAILABLE_KEYS = [ 'API_URL', 'BROKER_URL' ];

        if (!AVAILABLE_KEYS?.includes(key)) return;

        myConfig[key] = value;
    }

    myConfig.setVariable = setVariable;

    return myConfig;
}

const appConfig = configConstruct({ config: Config });


export default appConfig;
