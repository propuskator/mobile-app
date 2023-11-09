import CB from '@react-native-community/clipboard';

class Clipboard {
    set(value) {
        CB.setString(value);
    }

    async get() {
        return CB.getString();
    }
}

export default new Clipboard();
