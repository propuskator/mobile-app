export const SET_LINK = 'SET_LINK';
export const SET_PARAMS = 'SET_PARAMS';

export function setLink(deepLinkUrl) {
    return {
        type    : SET_LINK,
        payload : { deepLinkUrl }
    };
}

export function setParams(deepLinkParams) {
    return {
        type    : SET_PARAMS,
        payload : { deepLinkParams }
    };
}
