export const SHOW_MESSAGE    = 'SHOW_MESSAGE';
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

export function showMessage(payload) {
    return {
        type : SHOW_MESSAGE,
        payload
    };
}

export function dismissMessage() {
    return {
        type : DISMISS_MESSAGE
    };
}

