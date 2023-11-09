export function debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () { // eslint-disable-line  func-style,  func-names
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

export function generateRandomString() {
    return Math.random().toString(36).substr(2, 10);
}

export function capitalize(s = '') {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
