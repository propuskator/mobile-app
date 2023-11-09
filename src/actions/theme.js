export const UPDATE_THEME_VALUE      = 'UPDATE_THEME_VALUE';
export const INITIALIZED_THEME_MODE  = 'INITIALIZED_THEME_MODE';
export const UPDATE_APPEARANCE_VALUE = 'UPDATE_APPEARANCE_VALUE';

export function updateThemeValue(mode) {
    return  {
        type    : UPDATE_THEME_VALUE,
        payload : { mode }
    };
}

export function initializeThemeMode() {
    return { type: INITIALIZED_THEME_MODE };
}
