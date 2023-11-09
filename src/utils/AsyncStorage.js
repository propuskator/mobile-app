import AsyncStorage from '@react-native-community/async-storage';

class Storage {
    static setItem(key, value, cb) {
        const strValue = typeof value !== 'string'
            ? JSON.stringify(value)
            : value;

        return AsyncStorage.setItem(key, strValue, cb);
    }

    static async getItem(key, cb) {
        const res = await AsyncStorage.getItem(key, cb);

        try {
            if (res !== null) {
                return JSON.parse(res);
            }

            return res;
        } catch (e) {
            return res;
        }
    }

    static clear(cb) {
        return AsyncStorage.clear(cb);
    }
}

export default Storage;
