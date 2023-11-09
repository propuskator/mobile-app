import api                from '../../apiSingleton';
import { detectLanguage } from '../../utils/i18n';
import Storage            from '../AsyncStorage';


export async function setLanguageToStorage(lang) {
    api.apiClient.setLanguage(lang);
    await Storage.setItem('APP_LANG', lang);
}

export async function getLanguageFromStorage() {
    const lang = await Storage.getItem('APP_LANG') || null;

    return lang;
}

export async function setInitialLanguage() {
    const lang = await detectLanguage();

    api.apiClient.setLanguage(lang);
}

export async function saveThemeValueToStorage(value) {
    Storage.setItem('isDarkTheme', value);
}

export async function getThemeValueFromStorage() {
    const theme = await Storage.getItem('isDarkTheme');

    return theme;
}
