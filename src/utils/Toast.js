import T from 'react-native-simple-toast';

class Toast {
    show(message, duration = T.LONG) {
        T.show(message, duration);
    }
}

export default new Toast();
